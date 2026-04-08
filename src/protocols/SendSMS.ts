import { HttpRequest } from "@ingestkorea/util-http-handler";
import { SensClientResolvedConfig, RequestSerializer, ResponseDeserializer, SendSMSResult } from "../models/index.js";
import { SendSMSCommandInput, SendSMSCommandOutput } from "../commands/SendSMSCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";

export const se_SendSMSCommand: RequestSerializer<SendSMSCommandInput, SensClientResolvedConfig> = async (
  input,
  config
) => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/sms/v2/services/" + config.serviceId.sms + "/messages";
  const headers = {
    "content-type": "application/json; charset=utf-8",
    host: hostname,
  };
  const body = JSON.stringify({ ...input });

  return new HttpRequest({
    protocol: "https:",
    method: "POST",
    hostname,
    path,
    headers,
    body,
  });
};

export const de_SendSMSCommand: ResponseDeserializer<SendSMSCommandOutput, SensClientResolvedConfig> = async (
  response,
  config
) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_SendSMSResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

export const de_SendSMSResult = (output: any): SendSMSResult => {
  return {
    requestId: output.requestId ? output.requestId : undefined,
    requestTime: output.requestTime ? output.requestTime : undefined,
    statusCode: output.statusCode ? output.statusCode : undefined,
    statusName: output.statusName ? output.statusName : undefined,
  };
};
