import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  SensClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  GetSMSResultResult,
  SMSMessageStatus,
  File,
} from "../models/index.js";
import { GetSMSResultCommandInput, GetSMSResultCommandOutput } from "../commands/GetSMSResultCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";
import { de_SMSMessageRequestStatus } from "./GetSMSStatus.js";

export const se_GetSMSResultCommand: RequestSerializer<GetSMSResultCommandInput, SensClientResolvedConfig> = async (
  input,
  config
) => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/sms/v2/services/" + config.serviceId.sms + "/messages" + "/" + input.messageId;
  const headers = {
    host: hostname,
  };

  return new HttpRequest({
    protocol: "https:",
    method: "GET",
    hostname,
    path,
    headers,
  });
};

export const de_GetSMSResultCommand: ResponseDeserializer<GetSMSResultCommandOutput, SensClientResolvedConfig> = async (
  response,
  config
) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_GetSMSResultResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_GetSMSResultResult = (output: any): GetSMSResultResult => {
  return {
    statusCode: output.statusCode ? output.statusCode : undefined,
    statusName: output.statusName ? output.statusName : undefined,
    messages: output.messages ? de_SMSMessageStatusList(output.messages) : [],
  };
};

const de_SMSMessageStatusList = (output: any[]): SMSMessageStatus[] => {
  return (output || []).filter((e) => e != null).map((entry) => de_SMSMessageStatus(entry));
};

const de_SMSMessageStatus = (output: any): SMSMessageStatus => {
  return {
    ...de_SMSMessageRequestStatus(output),
    content: output.content != undefined ? output.content : undefined,
    status: output.status != undefined ? output.status : undefined,
    statusCode: output.statusCode != undefined ? output.statusCode : undefined,
    statusMessage: output.statusMessage != undefined ? output.statusMessage : undefined,
    statusName: output.statusName != undefined ? output.statusName : undefined,
    completeTime: output.completeTime != undefined ? output.completeTime : undefined,
    telcoCode: output.telcoCode != undefined ? output.telcoCode : undefined,
    files: output.files != undefined ? de_FileList(output.files) : undefined,
  };
};

const de_FileList = (output: any[]): File[] => {
  return (output || []).filter((e) => e != null).map((entry) => de_File(entry));
};

const de_File = (output: any): File => {
  return {
    name: output.name != undefined ? output.name : undefined,
  };
};
