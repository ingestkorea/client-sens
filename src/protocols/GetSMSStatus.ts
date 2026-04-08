import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  SensClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  GetSMSStatusResult,
  SMSMessageRequestStatus,
} from "../models/index.js";
import { GetSMSStatusCommandInput, GetSMSStatusCommandOutput } from "../commands/GetSMSStatusCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";

export const se_GetSMSStatusCommand: RequestSerializer<GetSMSStatusCommandInput, SensClientResolvedConfig> = async (
  input,
  config
) => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/sms/v2/services/" + config.serviceId.sms + "/messages";
  const headers = {
    host: hostname,
  };
  const query = {
    requestId: input.requestId,
  };

  return new HttpRequest({
    protocol: "https:",
    method: "GET",
    hostname,
    path,
    query,
    headers,
  });
};

export const de_GetSMSStatusCommand: ResponseDeserializer<GetSMSStatusCommandOutput, SensClientResolvedConfig> = async (
  response,
  config
) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_GetSMSStatusResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_GetSMSStatusResult = (output: any): GetSMSStatusResult => {
  return {
    requestId: output.requestId ? output.requestId : undefined,
    statusCode: output.statusCode ? output.statusCode : undefined,
    statusName: output.statusName ? output.statusName : undefined,
    messages: output.messages ? de_SMSMessageRequestStatusList(output.messages) : [],
  };
};

const de_SMSMessageRequestStatusList = (output: any[]): SMSMessageRequestStatus[] => {
  return (output || []).filter((e) => e != null).map((entry) => de_SMSMessageRequestStatus(entry));
};

export const de_SMSMessageRequestStatus = (output: any): SMSMessageRequestStatus => {
  return {
    messageId: output.messageId != undefined ? output.messageId : undefined,
    requestTime: output.requestTime != undefined ? output.requestTime : undefined,
    contentType: output.contentType != undefined ? output.contentType : undefined,
    countryCode: output.countryCode != undefined ? output.countryCode : undefined,
    from: output.from != undefined ? output.from : undefined,
    to: output.to != undefined ? output.to : undefined,
  };
};
