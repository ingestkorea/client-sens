import {
  SensClientResolvedConfig,
  SensCommand,
  SendAlimtalkRequest,
  SendAlimtalkResult,
  ALIMTALK_MAX_RECIPIENTS,
  ALIMTALK_MAX_CONTENT_LENGTH,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
  AlimtalkMessage,
  SensError,
} from "../models/index.js";
import { se_SendAlimtalkCommand, de_SendAlimtalkCommand } from "../protocols/SendAlimtalk.js";

export interface SendAlimtalkCommandInput extends SendAlimtalkRequest {}
export interface SendAlimtalkCommandOutput extends MetadataBearer, SendAlimtalkResult {}

export class SendAlimtalkCommand extends SensCommand<
  SendAlimtalkCommandInput,
  SendAlimtalkCommandOutput,
  SensClientResolvedConfig
> {
  input: SendAlimtalkCommandInput;
  serializer: RequestSerializer<SendAlimtalkCommandInput, SensClientResolvedConfig>;
  deserializer: ResponseDeserializer<SendAlimtalkCommandOutput, SensClientResolvedConfig>;
  constructor(input: SendAlimtalkCommandInput) {
    super(input);
    this.input = {
      plusFriendId: input.plusFriendId,
      templateCode: input.templateCode,
      messages: resolveAlimtalkMessages(input.messages, {
        maxRecipients: ALIMTALK_MAX_RECIPIENTS,
        maxContentLength: ALIMTALK_MAX_CONTENT_LENGTH,
      }),
    };
    this.serializer = se_SendAlimtalkCommand;
    this.deserializer = de_SendAlimtalkCommand;
  }
}

const resolveAlimtalkMessages = (
  messages: AlimtalkMessage[],
  config: { maxRecipients: number; maxContentLength: number }
): AlimtalkMessage[] => {
  if (!messages.length || messages.length > config.maxRecipients) {
    throw new SensError({
      code: 400,
      type: "Bad Request",
      message: "알림톡 동시 발송 범위 오류",
      invalidInputs: [
        {
          type: "not-valid.args",
          message: `메세지 동시 발송은 최소 1명, 최대 ${config.maxRecipients}명까지 가능합니다.`,
        },
      ],
    });
  }

  const result: AlimtalkMessage[] = messages.map((message) => {
    if (message.content.length > config.maxContentLength) {
      throw new SensError({
        code: 400,
        type: "Bad Request",
        message: "알림톡 최대 길이 초과",
        invalidInputs: [{ type: "not-valid.args", message: `메세지 최대 길이는 ${config.maxContentLength}글자입니다` }],
      });
    }

    return {
      to: message.to.replace(/\-/gi, ""),
      content: message.content,
      ...(message.buttons && message.buttons.length && { buttons: message.buttons }),
    };
  });

  return result;
};
