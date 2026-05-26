import {
  SensClientResolvedConfig,
  SensCommand,
  SendSMSRequest,
  SendSMSResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
  SMSMessage,
  MessageType,
  SensError,
} from "../models/index.js";
import { se_SendSMSCommand, de_SendSMSCommand } from "../protocols/SendSMS.js";
import { trimText, prettyPhoneNum, getContentLength } from "./constants.js";

export interface SendSMSCommandInput extends SendSMSRequest {}
export interface SendSMSCommandOutput extends MetadataBearer, SendSMSResult {}

export class SendSMSCommand extends SensCommand<SendSMSCommandInput, SendSMSCommandOutput, SensClientResolvedConfig> {
  input: SendSMSCommandInput;
  serializer: RequestSerializer<SendSMSCommandInput, SensClientResolvedConfig>;
  deserializer: ResponseDeserializer<SendSMSCommandOutput, SensClientResolvedConfig>;
  constructor(input: SendSMSCommandInput) {
    super(input);

    const content = input.content ? trimText(input.content) : "내용없음";
    const subject = input.subject ? trimText(input.subject) : "제목없음";

    const messages = resolveInputMessages(input.messages, { defaultContent: content, defaultSubject: subject });

    const isLMS = !!messages.filter((msg) => !!msg.subject).length;

    this.input = {
      from: prettyPhoneNum(input.from),
      content,
      messages,
      type: isLMS ? "LMS" : "SMS",
      contentType: input.contentType ? input.contentType : "COMM",
      countryCode: input.countryCode ? input.countryCode : "82",
      ...(isLMS && { subject }),
    };
    this.serializer = se_SendSMSCommand;
    this.deserializer = de_SendSMSCommand;
  }
}

export const resolveInputMessages = (
  messages: SMSMessage[],
  config: { defaultContent: string; defaultSubject: string }
): SMSMessage[] => {
  const output: SMSMessage[] = messages
    .filter((d) => !!d)
    .map((message) => {
      const content = message.content ? trimText(message.content) : config.defaultContent;
      const subject = message.subject ? trimText(message.subject) : config.defaultSubject;

      const msgType = getMessageType({ content });

      return {
        to: prettyPhoneNum(message.to),
        content,
        ...(msgType === "LMS" && { subject }),
      };
    });

  return output;
};

const getMessageType = (input: { content: string }): MessageType => {
  const SMS_MAX_CONTENT_LENGTH = 90;
  const LMS_MAX_CONTENT_LENGTH = 2000;

  const contentLength = getContentLength(input.content);

  if (!contentLength) {
    throw new SensError({
      code: -1,
      type: "SDK.GENERAL_ERROR",
      message: "메세지 내용이 없습니다.",
    });
  }

  if (contentLength > LMS_MAX_CONTENT_LENGTH) {
    throw new SensError({
      code: -1,
      type: "SDK.GENERAL_ERROR",
      message: `메세지 최대 길이는 ${LMS_MAX_CONTENT_LENGTH}글자입니다`,
    });
  }

  return contentLength > SMS_MAX_CONTENT_LENGTH ? "LMS" : "SMS";
};
