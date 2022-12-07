import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { GetRequestStatusOutput, StatusMessage } from '../models/GetRequestStatus';
import { SensClientResolvedConfig } from '../SensClient';
import {
  GetRequestStatusCommandInput,
  GetRequestStatusCommandOutput
} from '../commands/GetRequestStatusCommand';
import { parseBody, parseErrorBody } from './constants';

export const serializeIngestkorea_restJson_GetRequestStatusCommand = async (
  input: GetRequestStatusCommandInput,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/alimtalk/v2/services/" + config.serviceId.kakao + "/messages";
  const headers = {
    "host": hostname
  };
  const query = {
    requestId: input.requestId
  };
  return new HttpRequest({
    protocol: 'https:',
    method: 'GET',
    hostname: hostname,
    path: path,
    headers: headers,
    query: query
  });
};

export const deserializeIngestkorea_restJson_GetRequestStatusCommand = async (
  output: HttpResponse
): Promise<GetRequestStatusCommandOutput> => {
  if (output.statusCode > 300) await parseErrorBody(output);

  const data: any = await parseBody(output); // GetRequestStatusOutput
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_GetRequestStatusOutput(data);

  const response: GetRequestStatusCommandOutput = {
    ...contents
  };
  return response;
};

export const deserializeIngestkorea_restJson_GetRequestStatusOutput = async (
  output: any
): Promise<GetRequestStatusOutput> => {
  const { requestId, statusCode, statusName, messages } = output;
  return {
    requestId: requestId != undefined ? requestId : undefined,
    statusCode: statusCode != undefined ? statusCode : undefined,
    statusName: statusName != undefined ? statusName : undefined,
    messages: messages != undefined ? deserializeIngestkorea_restJson_GetRequestStatusMessages(messages) : undefined
  };
};

export const deserializeIngestkorea_restJson_GetRequestStatusMessages = (outputs: any[]): StatusMessage[] => {
  const result: StatusMessage[] = outputs.map(output => {
    return {
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
    };
  });
  return result;
};
