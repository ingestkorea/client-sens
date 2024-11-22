import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { SendMMSOutput, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import { SendMMSCommandInput, SendMMSCommandOutput } from "../commands/SendMMSCommand";
import { parseBody, parseErrorBody, deserializeMetadata } from "./constants";

export const serializeIngestkorea_restJson_SendMMSCommand = async (
  input: SendMMSCommandInput,
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
    type: input.type != undefined ? input.type : "MMS",
    files: input.files,
    ...(input.contentType != undefined && { contentType: input.contentType }),
    ...(input.countryCode != undefined && { countryCode: input.countryCode }),
    ...(input.subject != undefined && { subject: input.subject }),
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

export const deserializeIngestkorea_restJson_SendMMSCommand = async (response: {
  response: HttpResponse;
  output: MetadataBearer;
}): Promise<SendMMSCommandOutput> => {
  const { response: httpResponse, output } = response;
  if (httpResponse.statusCode > 300) await parseErrorBody(httpResponse);

  const data: any = await parseBody(httpResponse); // SendSMSOutput
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_SendMMSOutput(data);

  return {
    $metadata: {
      ...deserializeMetadata(httpResponse),
      ...output.$metadata,
    },
    ...contents,
  };
};

export const deserializeIngestkorea_restJson_SendMMSOutput = async (output: any): Promise<SendMMSOutput> => {
  return {
    requestId: output.requestId ? output.requestId : undefined,
    requestTime: output.requestTime ? output.requestTime : undefined,
    statusCode: output.statusCode ? output.statusCode : undefined,
    statusName: output.statusName ? output.statusName : undefined,
  };
};
