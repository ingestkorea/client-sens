import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { SendAlimtalkOutput, ReceivedMessage, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import { SendAlimtalkCommandInput, SendAlimtalkCommandOutput } from "../commands/SendAlimtalkCommand";
import { parseBody, parseErrorBody, deserializeMetadata } from "./constants";

export const serializeIngestkorea_restJson_SendAlimtalkCommand = async (
  input: SendAlimtalkCommandInput,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
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
    hostname: hostname,
    path: path,
    headers: headers,
    body: body,
  });
};

export const deserializeIngestkorea_restJson_SendAlimtalkCommand = async (response: {
  response: HttpResponse;
  output: MetadataBearer;
}): Promise<SendAlimtalkCommandOutput> => {
  const { response: httpResponse, output } = response;
  if (httpResponse.statusCode > 300) await parseErrorBody(httpResponse);

  const data: any = await parseBody(httpResponse); // SendAlimtalkCommandOutput
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_SendMessageOutput(data);

  return {
    $metadata: {
      ...deserializeMetadata(httpResponse),
      ...output.$metadata,
    },
    ...contents,
  };
};

export const deserializeIngestkorea_restJson_SendMessageOutput = async (output: any): Promise<SendAlimtalkOutput> => {
  return {
    requestId: output.requestId != undefined ? output.requestId : undefined,
    requestTime: output.requestTime != undefined ? output.requestTime : undefined,
    statusCode: output.statusCode != undefined ? output.statusCode : undefined,
    statusName: output.statusName != undefined ? output.statusName : undefined,
    messages:
      output.messages != undefined ? deserializeIngestkorea_restJson_ReceivedMessages(output.messages) : undefined,
  };
};

export const deserializeIngestkorea_restJson_ReceivedMessages = (outputs: any[]): ReceivedMessage[] => {
  const result: ReceivedMessage[] = outputs.map((output) => {
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
  });
  return result;
};
