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
    subject: output.subject ? output.subject : undefined,
    content: output.content ? output.content : undefined,
    files: output.files ? de_FileList(output.files) : [],
  };
};

const de_FileList = (output: any[]): File[] => {
  return (output || []).filter((e) => e != null).map((entry) => de_File(entry));
};

const de_File = (output: any): File => {
  return {
    fileId: output.fileId ? output.fileId : undefined,
    name: output.name ? output.name : undefined,
  };
};
