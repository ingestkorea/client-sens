import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { GetSMSStatusOutput, SMSStatusMessage, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import { GetSMSStatusCommandInput, GetSMSStatusCommandOutput } from "../commands/GetSMSStatusCommand";
import { parseBody, parseErrorBody, deserializeMetadata } from "./constants";

export const serializeIngestkorea_restJson_GetSMSStatusCommand = async (
  input: GetSMSStatusCommandInput,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
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
    hostname: hostname,
    path: path,
    query: query,
    headers: headers,
  });
};

export const deserializeIngestkorea_restJson_GetSMSStatusCommand = async (response: {
  response: HttpResponse;
  output: MetadataBearer;
}): Promise<GetSMSStatusCommandOutput> => {
  const { response: httpResponse, output } = response;
  if (httpResponse.statusCode > 300) await parseErrorBody(httpResponse);

  const data: any = await parseBody(httpResponse);
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_GetSMSStatusOutput(data);

  return {
    $metadata: {
      ...deserializeMetadata(httpResponse),
      ...output.$metadata,
    },
    ...contents,
  };
};

export const deserializeIngestkorea_restJson_GetSMSStatusOutput = async (output: any): Promise<GetSMSStatusOutput> => {
  return {
    requestId: output.requestId ? output.requestId : undefined,
    statusCode: output.statusCode ? output.statusCode : undefined,
    statusName: output.statusName ? output.statusName : undefined,
    messages: output.messages ? deserializeIngestkorea_restJson_SMSStatusMessage(output.messages) : undefined,
  };
};

export const deserializeIngestkorea_restJson_SMSStatusMessage = (outputs: any[]): SMSStatusMessage[] => {
  let result: SMSStatusMessage[] = outputs.map((output) => {
    return {
      messageId: output.messageId != undefined ? output.messageId : undefined,
      requestTime: output.requestTime != undefined ? output.requestTime : undefined,
      contentType: output.contentType != undefined ? output.contentType : undefined,
      countryCode: output.countryCode != undefined ? output.countryCode : undefined,
      from: output.from != undefined ? output.from : undefined,
      to: output.to != undefined ? output.to : undefined,
    };
  });
  return result;
};
