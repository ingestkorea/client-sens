import { NodeHttpHandler } from "@ingestkorea/util-http-handler";
import {
  SensClientConfig,
  SensClientResolvedConfig,
  SensCommand,
  Middleware,
  Handler,
  SensError,
} from "./models/index.js";
import { middlewareIngestkoreaMetadata, middlewareNcpSign, middlewareRetry } from "./middleware/index.js";

export class SensClient {
  config: SensClientResolvedConfig;
  private httpHandler = new NodeHttpHandler({ connectionTimeout: 3000, socketTimeout: 3000 });
  private requestHandler: Handler = async (input, context) => this.httpHandler.handle(input.request);

  constructor(config: SensClientConfig) {
    this.config = {
      credentials: resolveCredentials(config),
      serviceId: resolveServiceId(config),
    };
  }

  async send<T, P>(command: SensCommand<T, P, SensClientResolvedConfig>): Promise<P> {
    const { input, serializer, deserializer } = command;

    const middlewares: Middleware[] = [middlewareIngestkoreaMetadata, middlewareNcpSign, middlewareRetry];
    const handler = composeMiddleware(middlewares, this.requestHandler);

    try {
      const request = await serializer(input, this.config);
      const { response } = await handler({ request }, this.config);
      const output = await deserializer(response, this.config);
      return output;
    } catch (err) {
      if (err instanceof SensError) throw err;
      throw new SensError({
        code: -1,
        type: "SDK.UNKNOWN_ERROR",
        message: err instanceof Error ? err.message : "unknown error",
      });
    }
  }
}

const composeMiddleware = (middlewares: Middleware[], finalHandler: Handler): Handler => {
  const handler = middlewares.reduceRight((next, middleware) => {
    return middleware(next);
  }, finalHandler);
  return handler;
};

const resolveCredentials = (config: SensClientConfig): SensClientResolvedConfig["credentials"] => {
  const { credentials } = config;

  const error = new SensError({
    code: -1,
    type: "SDK.AUTH_ERROR",
    message: "SensClient 초기화시 인증 정보를 입력해주세요.",
  });

  if (!credentials) throw error;
  if (!credentials.accessKey) {
    error.message = "AccessKey 정보를 확인해주세요.";
    throw error;
  }
  if (!credentials.secretKey) {
    error.message = "SecretKey 정보를 확인해주세요.";
    throw error;
  }

  return {
    accessKey: credentials.accessKey,
    secretKey: credentials.secretKey,
  };
};

const resolveServiceId = (config: SensClientConfig): SensClientResolvedConfig["serviceId"] => {
  const { serviceId } = config;

  const error = new SensError({
    code: -1,
    type: "SDK.GENERAL_ERROR",
    message: "SensClient 초기화시 사용할 서비스 정보를 입력해주세요.",
  });

  if (!serviceId) throw error;

  const isReady = !!Object.values(serviceId).filter((d) => !!d).length;
  if (!isReady) {
    error.message = "최소 1개 이상의 서비스 정보가 필요합니다";
    throw error;
  }

  return {
    kakao: serviceId.kakao ?? "",
    sms: serviceId.sms ?? "",
  };
};
