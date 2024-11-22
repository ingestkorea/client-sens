import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { GetAlimtalkResultOutput, Failover, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import { GetAlimtalkResultCommandInput, GetAlimtalkResultCommandOutput } from "../commands/GetAlimtalkResultCommand";
import { parseBody, parseErrorBody, deserializeMetadata } from "./constants";

export const serializeIngestkorea_restJson_GetAlimtalkResultCommand = async (
  input: GetAlimtalkResultCommandInput,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/alimtalk/v2/services/" + config.serviceId.kakao + "/messages/" + input.messageId;
  const headers = {
    host: hostname,
  };
  return new HttpRequest({
    protocol: "https:",
    method: "GET",
    hostname: hostname,
    path: path,
    headers: headers,
  });
};

export const deserializeIngestkorea_restJson_GetAlimtalkResultCommand = async (response: {
  response: HttpResponse;
  output: MetadataBearer;
}): Promise<GetAlimtalkResultCommandOutput> => {
  const { response: httpResponse, output } = response;
  if (httpResponse.statusCode > 300) await parseErrorBody(httpResponse);

  const data: any = await parseBody(httpResponse);
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_GetAlimtalkResultOutput(data);

  return {
    $metadata: {
      ...deserializeMetadata(httpResponse),
      ...output.$metadata,
    },
    ...contents,
  };
};

export const deserializeIngestkorea_restJson_GetAlimtalkResultOutput = async (
  output: any
): Promise<GetAlimtalkResultOutput> => {
  return {
    requestId: output.requestId != undefined ? output.requestId : undefined,

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

    failover:
      output.failover != undefined ? deserializeIngestkorea_restJson_AlimtalkFailover(output.failover) : undefined,
  };
};

export const deserializeIngestkorea_restJson_AlimtalkFailover = (output: any): Failover => {
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
