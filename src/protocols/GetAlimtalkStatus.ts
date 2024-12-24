import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { GetAlimtalkStatusOutput, StatusMessage, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import { GetAlimtalkStatusCommandInput, GetAlimtalkStatusCommandOutput } from "../commands/GetAlimtalkStatusCommand";
import { parseBody, parseErrorBody, deserializeMetadata, parseReceivedMessage } from "./";

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

  const data: any = await parseBody(httpResponse);
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
  return {
    requestId: output.requestId != undefined ? output.requestId : undefined,
    statusCode: output.statusCode != undefined ? output.statusCode : undefined,
    statusName: output.statusName != undefined ? output.statusName : undefined,
    messages:
      output.messages != undefined
        ? deserializeIngestkorea_restJson_GetAlimtalkStatusMessages(output.messages)
        : undefined,
    pageSize: output.pageSize != undefined ? output.pageSize : undefined,
    pageIndex: output.pageIndex != undefined ? output.pageIndex : undefined,
    itemCount: output.itemCount != undefined ? output.itemCount : undefined,
    hasMore: output.hasMore != undefined ? output.hasMore : undefined,
  };
};

export const deserializeIngestkorea_restJson_GetAlimtalkStatusMessages = (outputs: any[]): StatusMessage[] => {
  const result: StatusMessage[] = outputs.map(parseStatusMessage);
  return result;
};

export const parseStatusMessage = (output: any): StatusMessage => {
  return {
    ...parseReceivedMessage(output),
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
