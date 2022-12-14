import { NodeHttpHandler } from '@ingestkorea/util-http-handler';
import { IngestkoreaError } from '@ingestkorea/util-error-handler';
import { SensCommand } from './models';
import { middlewareNcpSigner, middlewareIngestkoreaMetadata } from './middleware';

export type Credentials = {
  accessKey: string,
  secretKey: string,
};
export type ServiceId = {
  push?: string
  sms?: string
  kakao?: string
};

export interface SensClientConfig {
  credentials?: Credentials,
  serviceId?: ServiceId
};

export interface SensClientResolvedConfig {
  credentials: Credentials,
  serviceId: ServiceId
};

export class SensClient {
  config: SensClientResolvedConfig;
  requestHandler: NodeHttpHandler
  constructor(config: SensClientConfig) {
    const resolvedCredentials = resolveCredentials(config);
    const resolvedServiceId = resolveServiceId(config)
    this.config = {
      credentials: { ...resolvedCredentials },
      serviceId: { ...resolvedServiceId }
    };
    this.requestHandler = new NodeHttpHandler({ connectionTimeout: 3000, socketTimeout: 3000 });
  };
  async send<T, P>(command: SensCommand<T, P, SensClientResolvedConfig>): Promise<P> {
    let input = command.input;
    let request = await command.serialize(input, this.config);
    request = await middlewareNcpSigner(request, this.config);
    request = await middlewareIngestkoreaMetadata(request, this.config);
    let { response } = await this.requestHandler.handle(request);
    let output = await command.deserialize(response);
    return output;
  };
};

const resolveCredentials = (config: SensClientConfig): Required<Credentials> => {
  const { credentials } = config;
  if (!credentials) throw new IngestkoreaError({
    code: 401, type: 'Unauthorized',
    message: 'Invalid Credentials', description: 'Invalid Credentials'
  });
  return credentials;
};

const resolveServiceId = (config: SensClientConfig): ServiceId => {
  const { serviceId } = config;
  if (!serviceId) throw new IngestkoreaError({
    code: 401, type: 'Unauthorized',
    message: 'Invalid Credentials', description: 'Invalid ServiceId'
  });
  return {
    push: serviceId.push != undefined ? serviceId.push : undefined,
    sms: serviceId.sms != undefined ? serviceId.sms : undefined,
    kakao: serviceId.kakao != undefined ? serviceId.kakao : undefined
  };
};