import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { ListAlimtalkStatusOutput, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import { ListAlimtalkStatusCommandInput, ListAlimtalkStatusCommandOutput } from "../commands/ListAlimtalkStatusCommand";
import {
  parseBody,
  parseErrorBody,
  deserializeMetadata,
  deserializeIngestkorea_restJson_GetAlimtalkStatusOutput,
} from "./";

export const serializeIngestkorea_restJson_ListAlimtalkStatusCommand = async (
  input: ListAlimtalkStatusCommandInput,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/alimtalk/v2/services/" + config.serviceId.kakao + "/messages";
  const headers = {
    host: hostname,
  };
  const query = {
    plusFriendId: input.plusFriendId,
    ...(input.requestId && { requestId: input.requestId }),
    ...(input.messageId && { messageId: input.messageId }),
    ...(input.requestStatusName && { requestStatusName: input.requestStatusName }),
    ...(input.messageStatusName && { messageStatusName: input.messageStatusName }),
    ...(input.templateCode && { templateCode: input.templateCode }),
    ...(input.to && { to: input.to.replace(/\-/gi, "") }),
    ...(input.requestStartTime && { requestStartTime: input.requestStartTime }),
    ...(input.requestEndTime && { requestEndTime: input.requestEndTime }),
    ...(input.pageIndex != null && { pageIndex: input.pageIndex.toString() }),
    ...(input.pageSize && { pageSize: input.pageSize.toString() }),
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

export const deserializeIngestkorea_restJson_ListAlimtalkStatusCommand = async (response: {
  response: HttpResponse;
  output: MetadataBearer;
}): Promise<ListAlimtalkStatusCommandOutput> => {
  const { response: httpResponse, output } = response;
  if (httpResponse.statusCode > 300) await parseErrorBody(httpResponse);

  const data: any = await parseBody(httpResponse);
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_ListAlimtalkStatusOutput(data);

  return {
    $metadata: {
      ...deserializeMetadata(httpResponse),
      ...output.$metadata,
    },
    ...contents,
  };
};

export const deserializeIngestkorea_restJson_ListAlimtalkStatusOutput = async (
  output: any
): Promise<ListAlimtalkStatusOutput> => {
  return deserializeIngestkorea_restJson_GetAlimtalkStatusOutput(output);
};
