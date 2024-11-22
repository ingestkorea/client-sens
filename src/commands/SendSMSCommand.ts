import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { SensCommand, SendSMSInput, SendSMSOutput, MessageType, SMSMessage, SendFile, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import {
  serializeIngestkorea_restJson_SendSMSCommand,
  deserializeIngestkorea_restJson_SendSMSCommand,
} from "../protocols/SendSMS";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";
import { SMS_MAX, LMS_MAX, trimText, prettyPhoneNum, getContentLength } from "./constants";

export interface SendSMSCommandInput extends SendSMSInput {}
export interface SendSMSCommandOutput extends SendSMSOutput, MetadataBearer {}

export class SendSMSCommand extends SensCommand<SendSMSCommandInput, SendSMSCommandOutput, SensClientResolvedConfig> {
  input: SendSMSCommandInput;
  constructor(input: SendSMSCommandInput) {
    super(input);
    const { content, messageType: defaultMessageType } = resolveInputContent(input.content);
    const { messages, messageType: childMessageType } = resolveInputMessages(input.messages);

    this.input = {
      ...input,
      from: prettyPhoneNum(input.from),
      content: content,
      type: defaultMessageType === childMessageType ? defaultMessageType : "LMS",
      messages: messages,
    };
  }
  async serialize(input: SendSMSCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    if (!config.serviceId.sms)
      throw new IngestkoreaError({
        code: 400,
        type: "Bad Request",
        message: "Invalid Params",
        description: "Please Check SMS ServiceId",
      });
    let request = await serializeIngestkorea_restJson_SendSMSCommand(input, config);
    return request;
  }
  async deserialize(response: { response: HttpResponse; output: MetadataBearer }): Promise<SendSMSCommandOutput> {
    let output = await deserializeIngestkorea_restJson_SendSMSCommand(response);
    return output;
  }
}

const getMessageType = (input: string): MessageType => {
  const contentLength = getContentLength(input);
  if (!contentLength)
    throw new IngestkoreaError({
      code: 400,
      type: "Bad Request",
      message: "Invalid Request",
      description: `Please check input message`,
    });
  if (contentLength > LMS_MAX)
    throw new IngestkoreaError({
      code: 400,
      type: "Bad Request",
      message: "Invalid Request",
      description: `Maximum message length is ${LMS_MAX}bytes`,
    });
  return contentLength > SMS_MAX ? "LMS" : "SMS";
};

const resolveInputContent = (content: string): { content: string; messageType: MessageType } => {
  const resolvedContent = trimText(content);
  const messageType = getMessageType(resolvedContent);
  return {
    content: resolvedContent,
    messageType: messageType,
  };
};

const resolveInputMessages = (messages: SMSMessage[]): { messages: SMSMessage[]; messageType: MessageType } => {
  let init: { messages: SMSMessage[]; messageType: MessageType } = {
    messages: [],
    messageType: "SMS",
  };

  const output = messages.reduce((acc, message) => {
    const to = prettyPhoneNum(message.to);
    const content = message.content != undefined ? trimText(message.content) : undefined;
    const subject = message.subject != undefined ? trimText(message.subject) : undefined;

    const messageType: MessageType = content != undefined ? getMessageType(content) : "SMS";

    if (messageType == "LMS") acc.messageType = messageType;
    acc.messages.push({
      to: to,
      ...(content != undefined && { content: content }),
      ...(subject != undefined && acc.messageType === "LMS" && { subject: subject }),
    });

    return acc;
  }, init);
  return output;
};
