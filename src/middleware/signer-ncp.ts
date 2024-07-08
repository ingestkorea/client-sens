import { createHmac } from "crypto";
import { HttpRequest, buildQueryString } from "@ingestkorea/util-http-handler";
import { SensClientResolvedConfig } from "../SensClient";

export const middlewareNcpSigner = async (
  request: HttpRequest,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
  const { accessKey, secretKey } = config.credentials;

  const method = request.method;
  const queryString = buildQueryString(request.query);
  const path = queryString ? `${request.path}?${queryString}` : request.path;

  const space = " ";
  const newLine = "\n";
  const timestamp = new Date().getTime().toString();

  const stringToSign = [method + space + path, timestamp, accessKey].join(newLine);

  const signature = createHmac("sha256", secretKey).update(stringToSign).digest("base64");
  request.headers = {
    ...request.headers,
    ["x-ncp-iam-access-key"]: accessKey,
    ["x-ncp-apigw-timestamp"]: timestamp,
    ["x-ncp-apigw-signature-v2"]: signature,
  };
  return request;
};
