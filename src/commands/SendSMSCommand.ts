import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { SensCommand, SendSMSInput, SendSMSOutput, MessageType } from '../models';
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
    const content = textTrimming(input.content)
    const messageType = messageTypeChecker(content);
    this.input = {
      ...input,
      from: phoneNumPretty(input.from),
      content: content,
      type: input.type === messageType ? input.type : messageType,
      messages: input.messages.map(message => {
        return {
          to: phoneNumPretty(message.to),
          ...(message.content != undefined && { content: textTrimming(message.content) }),
          ...(message.subject != undefined && messageType === 'LMS' && { subject: textTrimming(message.subject) }),
        };
      })
    };
  };
  async serialize(input: SendSMSCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    if (!config.serviceId.sms) throw new IngestkoreaError({
      code: 400, type: 'Bad Request', message: 'Invalid Params', description:'Please Check SMS ServiceId'
    });
    let request = await serializeIngestkorea_restJson_SendSMSCommand(input, config);
    return request;
  };
  async deserialize(response: HttpResponse): Promise<SendSMSCommandOutput> {
    let output = await deserializeIngestkorea_restJson_SendSMSCommand(response);
    return output;
  };
};

const textTrimming = (input: string): string => input.trim();
const phoneNumPretty = (input: string): string => input.replace(/\-/gi, "");
const messageTypeChecker = (input: string): MessageType => {
  const MAXIMUM = 2000;
  const euckrByte = input.split('').reduce((acc, text) => {
    let byte = Buffer.from(text).length;
    let modulo = byte % 3
    modulo ? acc += 1 : acc += 2
    return acc;
  }, 0);

  if (!euckrByte) throw new IngestkoreaError({
    code: 400, type: 'Bad Request',
    message: 'Invalid Request', description: `Please check input message`
  });
  if (euckrByte > MAXIMUM) throw new IngestkoreaError({
    code: 400, type: 'Bad Request',
    message: 'Invalid Request', description: `Maximum message length is ${MAXIMUM}bytes`
  });
  return euckrByte > 80 ? 'LMS' : 'SMS';
};
