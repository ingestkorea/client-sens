import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { GetSMSResultOutput, SMSResultMessage, File } from "../models/GetSMSResult";
import { SensClientResolvedConfig } from "../SensClient";
import {
  GetSMSResultCommandInput,
  GetSMSResultCommandOutput,
} from "../commands/GetSMSResultCommand";
import { parseBody, parseErrorBody } from "./constants";

export const serializeIngestkorea_restJson_GetSMSResultCommand = async (
  input: GetSMSResultCommandInput,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/sms/v2/services/" + config.serviceId.sms + "/messages" + "/" + input.messageId;
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

export const deserializeIngestkorea_restJson_GetSMSResultCommand = async (
  output: HttpResponse
): Promise<GetSMSResultCommandOutput> => {
  if (output.statusCode > 300) await parseErrorBody(output);

  const data: any = await parseBody(output); // GetSMSResultOutput
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_GetSMSResultOutput(data);

  const response: GetSMSResultCommandOutput = {
    ...contents,
  };
  return response;
};

export const deserializeIngestkorea_restJson_GetSMSResultOutput = async (
  output: any
): Promise<GetSMSResultOutput> => {
  return {
    statusCode: output.statusCode ? output.statusCode : undefined,
    statusName: output.statusName ? output.statusName : undefined,
    messages: output.messages
      ? deserializeIngestkorea_restJson_SMSResultMessage(output.messages)
      : undefined,
  };
};

export const deserializeIngestkorea_restJson_SMSResultMessage = (
  outputs: any[]
): SMSResultMessage[] => {
  let result: SMSResultMessage[] = outputs.map((output) => {
    return {
      requestTime: output.requestTime != undefined ? output.requestTime : undefined,
      contentType: output.contentType != undefined ? output.contentType : undefined,
      content: output.content != undefined ? output.content : undefined,
      countryCode: output.countryCode != undefined ? output.countryCode : undefined,
      from: output.from != undefined ? output.from : undefined,
      to: output.to != undefined ? output.to : undefined,
      status: output.status != undefined ? output.status : undefined,
      statusCode: output.statusCode != undefined ? output.statusCode : undefined,
      statusMessage: output.statusMessage != undefined ? output.statusMessage : undefined,
      statusName: output.statusName != undefined ? output.statusName : undefined,
      completeTime: output.completeTime != undefined ? output.completeTime : undefined,
      telcoCode: output.telcoCode != undefined ? output.telcoCode : undefined,
      files:
        output.files != undefined ? deserializeIngestkorea_restJson_File(output.files) : undefined,
    };
  });
  return result;
};

export const deserializeIngestkorea_restJson_File = (outputs: any[]): File[] => {
  let result: File[] = outputs.map((output) => {
    return {
      name: output.name != undefined ? output.name : undefined,
    };
  });
  return result;
};
