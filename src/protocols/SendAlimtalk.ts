import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  SensClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  SendAlimtalkResult,
  AlimtalkMessageRequestStatus,
} from "../models/index.js";
import { SendAlimtalkCommandInput, SendAlimtalkCommandOutput } from "../commands/SendAlimtalkCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact, convertToUtc } from "./constants.js";

export const se_SendAlimtalkCommand: RequestSerializer<SendAlimtalkCommandInput, SensClientResolvedConfig> = async (
  input,
  config
) => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/alimtalk/v2/services/" + config.serviceId.kakao + "/messages";
  const headers = {
    "content-type": "application/json; charset=utf-8",
    host: hostname,
  };
  const body = JSON.stringify({
    plusFriendId: input.plusFriendId,
    templateCode: input.templateCode,
    messages: input.messages,
  });

  return new HttpRequest({
    protocol: "https:",
    method: "POST",
    hostname,
    path,
    headers,
    body,
  });
};

export const de_SendAlimtalkCommand: ResponseDeserializer<SendAlimtalkCommandOutput, SensClientResolvedConfig> = async (
  response,
  config
) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_SendAlimtalkResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_SendAlimtalkResult = (output: any): SendAlimtalkResult => {
  return {
    requestId: output.requestId != undefined ? output.requestId : undefined,
    requestTime: output.requestTime != undefined ? convertToUtc(output.requestTime) : undefined,
    statusCode: output.statusCode != undefined ? output.statusCode : undefined,
    statusName: output.statusName != undefined ? output.statusName : undefined,
    messages: output.messages ? de_AlimtalkMessageRequestStatusList(output.messages) : [],
  };
};

const de_AlimtalkMessageRequestStatusList = (output: any[]): AlimtalkMessageRequestStatus[] => {
  const result = (output || []).filter((e) => e != null).map((entry) => de_AlimtalkMessageRequestStatus(entry));
  return result;
};

export const de_AlimtalkMessageRequestStatus = (output: any): AlimtalkMessageRequestStatus => {
  return {
    messageId: output.messageId != undefined ? output.messageId : undefined,
    to: output.to != undefined ? output.to : undefined,
    countryCode: output.countryCode != undefined ? output.countryCode : undefined,
    content: output.content != undefined ? output.content : undefined,
    requestStatusCode: output.requestStatusCode != undefined ? output.requestStatusCode : undefined,
    requestStatusName: output.requestStatusName != undefined ? output.requestStatusName : undefined,
    requestStatusDesc: output.requestStatusDesc != undefined ? output.requestStatusDesc : undefined,
    useSmsFailover: output.useSmsFailover != undefined ? output.useSmsFailover : undefined,
  };
};
