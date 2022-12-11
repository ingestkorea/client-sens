import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { SensCommand, SendSMSInput, SendSMSOutput, MessageType, SMSMessage } from '../models';
import { SensClientResolvedConfig } from '../SensClient';
import {
  serializeIngestkorea_restJson_SendSMSCommand,
  deserializeIngestkorea_restJson_SendSMSCommand
} from '../protocols/SendSMS';
import { IngestkoreaError } from '@ingestkorea/util-error-handler';

export interface SendSMSCommandInput extends SendSMSInput { };
export interface SendSMSCommandOutput extends SendSMSOutput { };

export class SendSMSCommand extends SensCommand<
  SendSMSCommandInput, SendSMSCommandOutput, SensClientResolvedConfig
>{
  input: SendSMSCommandInput
  constructor(input: SendSMSCommandInput) {
    super(input);
    const content = trimText(input.content)
    const { messages, messageType: childMessageType } = resolveInputMessages(input.messages);
    const messageType = childMessageType == 'LMS' ? childMessageType : checkMessageType(content);
    this.input = {
      ...input,
      from: prettyPhoneNum(input.from),
      content: content,
      type: messageType,
      messages: messages
    };
  };
  async serialize(input: SendSMSCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    if (!config.serviceId.sms) throw new IngestkoreaError({
      code: 400, type: 'Bad Request', message: 'Invalid Params', description: 'Please Check SMS ServiceId'
    });
    let request = await serializeIngestkorea_restJson_SendSMSCommand(input, config);
    return request;
  };
  async deserialize(response: HttpResponse): Promise<SendSMSCommandOutput> {
    let output = await deserializeIngestkorea_restJson_SendSMSCommand(response);
    return output;
  };
};

const trimText = (input: string): string => input.trim();
const prettyPhoneNum = (input: string): string => input.replace(/\-/gi, "");

const getTextBytes = (input: string): number => {
  return input.split('').reduce((acc, text) => {
    let byte = Buffer.from(text).length;
    let modulo = byte % 3
    modulo ? acc += 1 : acc += 2
    return acc;
  }, 0);
};

const checkMessageType = (input: string): MessageType => {
  const SMS_MAX = 90;
  const LMS_MAX = 2000;
  const euckrBytes = getTextBytes(input)

  if (!euckrBytes) throw new IngestkoreaError({
    code: 400, type: 'Bad Request',
    message: 'Invalid Request', description: `Please check input message`
  });
  if (euckrBytes > LMS_MAX) throw new IngestkoreaError({
    code: 400, type: 'Bad Request',
    message: 'Invalid Request', description: `Maximum message length is ${LMS_MAX}bytes`
  });
  return euckrBytes > SMS_MAX ? 'LMS' : 'SMS';
};
const resolveInputMessages = (messages: SMSMessage[]): { messages: SMSMessage[], messageType: MessageType } => {
  let resolvedMessageType: MessageType = 'SMS';
  let resolvedMessages: SMSMessage[] = messages.map(message => {
    const resolvedContent = message.content != undefined ? trimText(message.content) : '';
    const resolvedSubject = message.subject != undefined ? trimText(message.subject) : '';
    const messageType = !!resolvedContent != false ? checkMessageType(resolvedContent) : 'SMS';

    if (messageType === 'LMS') resolvedMessageType = messageType;

    return {
      to: prettyPhoneNum(message.to),
      ...(!!resolvedContent != false && { content: resolvedContent }),
      ...(!!resolvedSubject != false && messageType === 'LMS' && { subject: resolvedSubject }),
    };
  });
  return { messages: resolvedMessages, messageType: resolvedMessageType };
};
