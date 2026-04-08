import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  SensClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  GetAlimtalkStatusResult,
  AlimtalkMessageStatus,
} from "../models/index.js";
import { GetAlimtalkStatusCommandInput, GetAlimtalkStatusCommandOutput } from "../commands/GetAlimtalkStatusCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";
import { de_AlimtalkMessageRequestStatus } from "./SendAlimtalk.js";

export const se_GetAlimtalkStatusCommand: RequestSerializer<
  GetAlimtalkStatusCommandInput,
  SensClientResolvedConfig
> = async (input, config) => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/alimtalk/v2/services/" + config.serviceId.kakao + "/messages";
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
    headers,
    query,
  });
};

export const de_GetAlimtalkStatusCommand: ResponseDeserializer<
  GetAlimtalkStatusCommandOutput,
  SensClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_GetAlimtalkStatusResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

export const de_GetAlimtalkStatusResult = (output: any): GetAlimtalkStatusResult => {
  return {
    requestId: output.requestId != undefined ? output.requestId : undefined,
    statusCode: output.statusCode != undefined ? output.statusCode : undefined,
    statusName: output.statusName != undefined ? output.statusName : undefined,
    messages: output.messages ? de_AlimtalkMessageStatusList(output.messages) : [],
    pageSize: output.pageSize !== undefined ? output.pageSize : undefined,
    pageIndex: output.pageIndex !== undefined ? output.pageIndex : undefined,
    itemCount: output.itemCount !== undefined ? output.itemCount : undefined,
    hasMore: output.hasMore !== undefined ? output.hasMore : undefined,
    nextToken: output.nextToken != undefined ? output.nextToken : undefined,
  };
};

const de_AlimtalkMessageStatusList = (output: any[]): AlimtalkMessageStatus[] => {
  return (output || []).filter((e) => e != null).map((entry) => de_AlimtalkMessageStatus(entry));
};

export const de_AlimtalkMessageStatus = (output: any): AlimtalkMessageStatus => {
  return {
    ...de_AlimtalkMessageRequestStatus(output),
    requestId: output.requestId != undefined ? output.requestId : undefined,
    requestTime: output.requestTime != undefined ? output.requestTime : undefined,
    plusFriendId: output.plusFriendId != undefined ? output.plusFriendId : undefined,
    templateCode: output.templateCode != undefined ? output.templateCode : undefined,
    completeTime: output.completeTime != undefined ? output.completeTime : undefined,
    messageStatusCode: output.messageStatusCode != undefined ? output.messageStatusCode : undefined,
    messageStatusName: output.messageStatusName != undefined ? output.messageStatusName : undefined,
    messageStatusDesc: output.messageStatusDesc != undefined ? output.messageStatusDesc : undefined,
  };
};
