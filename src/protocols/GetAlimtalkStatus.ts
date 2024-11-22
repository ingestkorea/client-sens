import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { GetAlimtalkStatusOutput, StatusMessage, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import { GetAlimtalkStatusCommandInput, GetAlimtalkStatusCommandOutput } from "../commands/GetAlimtalkStatusCommand";
import { parseBody, parseErrorBody, deserializeMetadata } from "./constants";

export const serializeIngestkorea_restJson_GetAlimtalkStatusCommand = async (
  input: GetAlimtalkStatusCommandInput,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/alimtalk/v2/services/" + config.serviceId.kakao + "/messages";
  const headers = {
    host: hostname,
  };
  const query = {
    requestId: input.requestId,
  };
  return new HttpRequest({
    protocol: "https:",
    method: "GET",
    hostname: hostname,
    path: path,
    headers: headers,
    query: query,
  });
};

export const deserializeIngestkorea_restJson_GetAlimtalkStatusCommand = async (response: {
  response: HttpResponse;
  output: MetadataBearer;
}): Promise<GetAlimtalkStatusCommandOutput> => {
  const { response: httpResponse, output } = response;
  if (httpResponse.statusCode > 300) await parseErrorBody(httpResponse);

  const data: any = await parseBody(httpResponse); // GetAlimtalkStatusOutput
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_GetAlimtalkStatusOutput(data);

  return {
    $metadata: {
      ...deserializeMetadata(httpResponse),
      ...output.$metadata,
    },
    ...contents,
  };
};

export const deserializeIngestkorea_restJson_GetAlimtalkStatusOutput = async (
  output: any
): Promise<GetAlimtalkStatusOutput> => {
  const { requestId, statusCode, statusName, messages } = output;
  return {
    requestId: requestId != undefined ? requestId : undefined,
    statusCode: statusCode != undefined ? statusCode : undefined,
    statusName: statusName != undefined ? statusName : undefined,
    messages: messages != undefined ? deserializeIngestkorea_restJson_GetAlimtalkStatusMessages(messages) : undefined,
  };
};

export const deserializeIngestkorea_restJson_GetAlimtalkStatusMessages = (outputs: any[]): StatusMessage[] => {
  const result: StatusMessage[] = outputs.map((output) => {
    return {
      messageId: output.messageId != undefined ? output.messageId : undefined,
      to: output.to != undefined ? output.to : undefined,
      countryCode: output.countryCode != undefined ? output.countryCode : undefined,
      content: output.content != undefined ? output.content : undefined,
      requestStatusCode: output.requestStatusCode != undefined ? output.requestStatusCode : undefined,
      requestStatusName: output.requestStatusName != undefined ? output.requestStatusName : undefined,
      requestStatusDesc: output.requestStatusDesc != undefined ? output.requestStatusDesc : undefined,
      useSmsFailover: output.useSmsFailover != undefined ? output.useSmsFailover : undefined,

      requestTime: output.requestTime != undefined ? output.requestTime : undefined,
      plusFriendId: output.plusFriendId != undefined ? output.plusFriendId : undefined,
      templateCode: output.templateCode != undefined ? output.templateCode : undefined,
      completeTime: output.completeTime != undefined ? output.completeTime : undefined,
      messageStatusCode: output.messageStatusCode != undefined ? output.messageStatusCode : undefined,
      messageStatusName: output.messageStatusName != undefined ? output.messageStatusName : undefined,
      messageStatusDesc: output.messageStatusDesc != undefined ? output.messageStatusDesc : undefined,
    };
  });
  return result;
};
