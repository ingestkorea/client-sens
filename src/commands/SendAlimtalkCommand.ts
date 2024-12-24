import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { SensCommand, SendAlimtalkInput, SendAlimtalkOutput, AlimtalkMessage, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import {
  serializeIngestkorea_restJson_SendAlimtalkCommand,
  deserializeIngestkorea_restJson_SendAlimtalkCommand,
} from "../protocols/SendAlimtalk";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";

export interface SendAlimtalkCommandInput extends SendAlimtalkInput {}
export interface SendAlimtalkCommandOutput extends SendAlimtalkOutput, MetadataBearer {}

export class SendAlimtalkCommand extends SensCommand<
  SendAlimtalkCommandInput,
  SendAlimtalkCommandOutput,
  SensClientResolvedConfig
> {
  input: SendAlimtalkCommandInput;
  constructor(input: SendAlimtalkCommandInput) {
    super(input);
    this.input = {
      ...input,
      plusFriendId: input.plusFriendId,
      templateCode: input.templateCode,
      messages: resolveAlimtalkMessage(input.messages),
    };
  }
  async serialize(input: SendAlimtalkCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    if (!config.serviceId.kakao)
      throw new IngestkoreaError({
        code: 400,
        type: "Bad Request",
        message: "Invalid Params",
        description: "Please Check Kakao ServiceId",
      });
    let request = await serializeIngestkorea_restJson_SendAlimtalkCommand(input, config);
    return request;
  }
  async deserialize(response: { response: HttpResponse; output: MetadataBearer }): Promise<SendAlimtalkCommandOutput> {
    let output = await deserializeIngestkorea_restJson_SendAlimtalkCommand(response);
    return output;
  }
}

const resolveAlimtalkMessage = (messages: AlimtalkMessage[]): AlimtalkMessage[] => {
  const ALIMTALK_MAX = 1000;
  const lastError = new IngestkoreaError({
    code: 400,
    type: "Bad Request",
    message: "Invalid Params",
    description: `Maximum message length is ${ALIMTALK_MAX}`,
  });
  const result: AlimtalkMessage[] = messages.map((message) => {
    if (message.content.length > ALIMTALK_MAX) throw lastError;
    return {
      to: message.to.replace(/\-/gi, ""),
      content: message.content,
      ...(message.buttons && message.buttons.length && { buttons: message.buttons }),
    };
  });
  return result;
};
