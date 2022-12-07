import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { SendAlimtalkOutput, ReceivedMessage } from '../models/SendAlimtalk';
import { SensClientResolvedConfig } from '../SensClient';
import {
  SendAlimtalkCommandInput,
  SendAlimtalkCommandOutput
} from '../commands/SendAlimtalkCommand';
import { parseBody, parseErrorBody } from './constants';

export const serializeIngestkorea_restJson_SendAlimtalkCommand = async (
  input: SendAlimtalkCommandInput,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/alimtalk/v2/services/" + config.serviceId + "/messages";
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "host": hostname
  };
  const body = JSON.stringify({
    plusFriendId: input.plusFriendId,
    templateCode: input.templateCode,
    messages: input.messages
  });
  return new HttpRequest({
    protocol: 'https:',
    method: 'POST',
    hostname: hostname,
    path: path,
    headers: headers,
    body: body
  });
};

export const deserializeIngestkorea_restJson_SendAlimtalkCommand = async (
  output: HttpResponse
): Promise<SendAlimtalkCommandOutput> => {
  if (output.statusCode > 300) await parseErrorBody(output);

  const data: any = await parseBody(output); // SendAlimtalkCommandOutput
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_SendMessageOutput(data);

  const response: SendAlimtalkCommandOutput = {
    ...contents
  };
  return response;
};

export const deserializeIngestkorea_restJson_SendMessageOutput = async (
  output: any
): Promise<SendAlimtalkOutput> => {
  return {
    requestId: output.requestId != undefined ? output.requestId : undefined,
    requestTime: output.requestTime != undefined ? output.requestTime : undefined,
    statusCode: output.statusCode != undefined ? output.statusCode : undefined,
    statusName: output.statusName != undefined ? output.statusName : undefined,
    messages: output.messages != undefined ?
      deserializeIngestkorea_restJson_ReceivedMessages(output.messages) : undefined,
  };
};

export const deserializeIngestkorea_restJson_ReceivedMessages = (
  outputs: any[]
): ReceivedMessage[] => {
  const result: ReceivedMessage[] = outputs.map(output => {
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