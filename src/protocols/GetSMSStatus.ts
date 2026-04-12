import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  SensClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  GetSMSStatusResult,
  SMSMessageRequestStatus,
} from "../models/index.js";
import { GetSMSStatusCommandInput, GetSMSStatusCommandOutput } from "../commands/GetSMSStatusCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact, convertToUtc } from "./constants.js";

export const se_GetSMSStatusCommand: RequestSerializer<GetSMSStatusCommandInput, SensClientResolvedConfig> = async (
  input,
  config
) => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/sms/v2/services/" + config.serviceId.sms + "/messages";
  const headers = {
    host: hostname,
  };
  const query = Object.entries(input).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = String(value);
    }
    return acc;
  }, {} as Record<string, string>);

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

export const de_GetSMSStatusResult = (output: any): GetSMSStatusResult => {
  return {
    requestId: output.requestId ? output.requestId : undefined,
    statusCode: output.statusCode ? output.statusCode : undefined,
    statusName: output.statusName ? output.statusName : undefined,
    messages: output.messages ? de_SMSMessageRequestStatusList(output.messages) : [],
    pageSize: output.pageSize !== undefined ? output.pageSize : undefined,
    pageIndex: output.pageIndex !== undefined ? output.pageIndex : undefined,
    itemCount: output.itemCount !== undefined ? output.itemCount : undefined,
    hasMore: output.hasMore !== undefined ? output.hasMore : undefined,
    nextToken: output.nextToken ? output.nextToken : undefined,
  };
};

const de_SMSMessageRequestStatusList = (output: any[]): SMSMessageRequestStatus[] => {
  return (output || []).filter((e) => e != null).map((entry) => de_SMSMessageRequestStatus(entry));
};

export const de_SMSMessageRequestStatus = (output: any): SMSMessageRequestStatus => {
  return {
    requestId: output.requestId ? output.requestId : undefined,
    messageId: output.messageId ? output.messageId : undefined,
    requestTime: output.requestTime ? convertToUtc(output.requestTime) : undefined,
    contentType: output.contentType ? output.contentType : undefined,
    type: output.type ? output.type : undefined,
    countryCode: output.countryCode ? output.countryCode : undefined,
    from: output.from ? output.from : undefined,
    to: output.to ? output.to : undefined,
    completeTime: output.completeTime ? convertToUtc(output.completeTime) : undefined,
    telcoCode: output.telcoCode ? output.telcoCode : undefined,
    status: output.status ? output.status : undefined,
    statusCode: output.statusCode ? output.statusCode : undefined,
    statusName: output.statusName ? output.statusName : undefined,
    statusMessage: output.statusMessage ? output.statusMessage : undefined,
  };
};
