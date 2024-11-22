import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { SendSMSOutput, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import { SendSMSCommandInput, SendSMSCommandOutput } from "../commands/SendSMSCommand";
import { parseBody, parseErrorBody, deserializeMetadata } from "./constants";

export const serializeIngestkorea_restJson_SendSMSCommand = async (
  input: SendSMSCommandInput,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/sms/v2/services/" + config.serviceId.sms + "/messages";
  const headers = {
    "content-type": "application/json; charset=utf-8",
    host: hostname,
  };
  const body = JSON.stringify({
    from: input.from,
    content: input.content,
    messages: input.messages,
    type: input.type != undefined ? input.type : "SMS",
    ...(input.contentType != undefined && { contentType: input.contentType }),
    ...(input.countryCode != undefined && { countryCode: input.countryCode }),
    ...(input.subject != undefined && input.type === "LMS" && { subject: input.subject }),
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

export const deserializeIngestkorea_restJson_SendSMSCommand = async (response: {
  response: HttpResponse;
  output: MetadataBearer;
}): Promise<SendSMSCommandOutput> => {
  const { response: httpResponse, output } = response;
  if (httpResponse.statusCode > 300) await parseErrorBody(httpResponse);

  const data: any = await parseBody(httpResponse); // SendSMSOutput
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_SendSMSOutput(data);

  return {
    $metadata: {
      ...deserializeMetadata(httpResponse),
      ...output.$metadata,
    },
    ...contents,
  };
};

export const deserializeIngestkorea_restJson_SendSMSOutput = async (output: any): Promise<SendSMSOutput> => {
  return {
    requestId: output.requestId ? output.requestId : undefined,
    requestTime: output.requestTime ? output.requestTime : undefined,
    statusCode: output.statusCode ? output.statusCode : undefined,
    statusName: output.statusName ? output.statusName : undefined,
  };
};
