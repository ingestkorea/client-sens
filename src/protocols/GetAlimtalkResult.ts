import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  SensClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  GetAlimtalkResultResult,
  Failover,
} from "../models/index.js";
import { GetAlimtalkResultCommandInput, GetAlimtalkResultCommandOutput } from "../commands/GetAlimtalkResultCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";
import { de_AlimtalkMessageStatus } from "./GetAlimtalkStatus.js";

export const se_GetAlimtalkResultCommand: RequestSerializer<
  GetAlimtalkResultCommandInput,
  SensClientResolvedConfig
> = async (input, config) => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/alimtalk/v2/services/" + config.serviceId.kakao + "/messages/" + input.messageId;
  const headers = {
    host: hostname,
  };

  return new HttpRequest({
    protocol: "https:",
    method: "GET",
    hostname,
    path,
    headers,
  });
};

export const de_GetAlimtalkResultCommand: ResponseDeserializer<
  GetAlimtalkResultCommandOutput,
  SensClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_GetAlimtalkResultResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_GetAlimtalkResultResult = (output: any): GetAlimtalkResultResult => {
  return {
    ...de_AlimtalkMessageStatus(output),
    failover: output.failover ? de_Failover(output.failover) : undefined,
  };
};

const de_Failover = (output: any): Failover => {
  return {
    smsServiceId: output.smsServiceId != undefined ? output.smsServiceId : undefined,
    requestId: output.requestId != undefined ? output.requestId : undefined,
    requestStatusCode: output.requestStatusCode != undefined ? output.requestStatusCode : undefined,
    requestStatusName: output.requestStatusName != undefined ? output.requestStatusName : undefined,
    requestStatusDesc: output.requestStatusDesc != undefined ? output.requestStatusDesc : undefined,
    messageId: output.messageId != undefined ? output.messageId : undefined,
    messageStatus: output.messageStatus != undefined ? output.messageStatus : undefined,
    messageStatusCode: output.messageStatusCode != undefined ? output.messageStatusCode : undefined,
    messageStatusName: output.messageStatusName != undefined ? output.messageStatusName : undefined,
    messageStatusDesc: output.messageStatusDesc != undefined ? output.messageStatusDesc : undefined,
  };
};
