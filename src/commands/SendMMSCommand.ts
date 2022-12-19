import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { SensCommand, SendMMSInput, SendMMSOutput, MessageType, SMSMessage, SendFile } from '../models';
import { SensClientResolvedConfig } from '../SensClient';
import {
  serializeIngestkorea_restJson_SendMMSCommand,
  deserializeIngestkorea_restJson_SendMMSCommand
} from '../protocols/SendMMS';
import { IngestkoreaError } from '@ingestkorea/util-error-handler';
import { LMS_MAX, MMS_FILE_MAX, trimText, prettyPhoneNum, getContentLength } from './constants';

import { parse } from 'node:path';
import { randomUUID } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';

export interface SendMMSCommandInput extends SendMMSInput { };
export interface SendMMSCommandOutput extends SendMMSOutput { };

export class SendMMSCommand extends SensCommand<
  SendMMSCommandInput, SendMMSCommandOutput, SensClientResolvedConfig
>{
  input: SendMMSCommandInput
  constructor(input: SendMMSCommandInput) {
    super(input);
    this.input = {
      ...input,
      from: prettyPhoneNum(input.from),
      content: resolveInputContent(input.content),
      type: resolveInputMessageType(input.type),
      messages: resolveInputMessages(input.messages),
      files: resolveInputFiles(input.files)
    };
  };
  async serialize(input: SendMMSCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    if (!config.serviceId.sms) throw new IngestkoreaError({
      code: 400, type: 'Bad Request', message: 'Invalid Params', description: 'Please Check SMS ServiceId'
    });
    let request = await serializeIngestkorea_restJson_SendMMSCommand(input, config);
    return request;
  };
  async deserialize(response: HttpResponse): Promise<SendMMSCommandOutput> {
    let output = await deserializeIngestkorea_restJson_SendMMSCommand(response);
    return output;
  };
};

const resolveInputContent = (content: string): string => {
  const resolvedContent = trimText(content);
  const contentLength = getContentLength(resolvedContent);

  if (!contentLength) throw new IngestkoreaError({
    code: 400, type: 'Bad Request',
    message: 'Invalid Request', description: `Please check input message`
  });
  if (contentLength > LMS_MAX) throw new IngestkoreaError({
    code: 400, type: 'Bad Request',
    message: 'Invalid Request', description: `Maximum message length is ${LMS_MAX}bytes`
  });
  return resolvedContent;
};

const resolveInputMessages = (messages: SMSMessage[]): SMSMessage[] => messages.map(message => {
  return {
    to: prettyPhoneNum(message.to),
    ...(message.content != undefined && { content: resolveInputContent(message.content) }),
    ...(message.subject != undefined && { subject: trimText(message.subject) }),
  };
});

const resolveInputMessageType = (type?: MessageType): MessageType => {
  if (type == 'SMS' || type == 'LMS') throw new IngestkoreaError({
    code: 400, type: 'Bad Request',
    message: 'Invalid Request', description: `Please Call SendSMSCommand`
  });
  return 'MMS';
};

const resolveInputFiles = (files: SendFile[]): SendFile[] => {

  if (!files.length) throw new IngestkoreaError({
    code: 400, type: 'Bad Request',
    message: 'Invalid Request', description: `Please Check Input Files`
  });

  const output: SendFile[] = files.map(file => {
    const resolvedFileName = verifyFileName(file.name);
    const resolvedFileBody = file.body != undefined ? file.body : getFileBody(file.name);

    let byte = Buffer.from(resolvedFileBody, 'base64').length;
    let kib = Math.ceil(byte / 1024);
    if (kib > MMS_FILE_MAX) throw new IngestkoreaError({
      code: 400, type: 'Bad Request',
      message: 'Invalid Request',
      description: `Input File is ${kib}KiByte. Maximum File Size is ${MMS_FILE_MAX}Kibyte`
    });

    return { name: resolvedFileName, body: resolvedFileBody };
  });
  return output;
};

const verifyFileName = (fileName: string): string => {
  let { ext } = parse(fileName);
  const uuid = randomUUID();
  const extension = ext.replace(/jpeg|jpg/gi, "jpg");
  if (extension != '.jpg') throw new IngestkoreaError({
    code: 400, type: 'Bad Request',
    message: 'Invalid Request', description: `File Extension is not .jpg or .jpeg`
  });
  return [uuid, extension].join('');
};

/** @returns base64 */
const getFileBody = (fileName: string): string => {
  if (!existsSync(fileName)) throw new IngestkoreaError({
    code: 400, type: 'Bad Request',
    message: 'Invalid Request', description: `${fileName} does not exist.`
  });
  return readFileSync(fileName, { encoding: 'base64' });
};