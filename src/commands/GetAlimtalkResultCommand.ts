import {
  SensClientResolvedConfig,
  SensCommand,
  GetAlimtalkResultRequest,
  GetAlimtalkResultResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_GetAlimtalkResultCommand, de_GetAlimtalkResultCommand } from "../protocols/GetAlimtalkResult.js";

export interface GetAlimtalkResultCommandInput extends GetAlimtalkResultRequest {}
export interface GetAlimtalkResultCommandOutput extends MetadataBearer, GetAlimtalkResultResult {}

export class GetAlimtalkResultCommand extends SensCommand<
  GetAlimtalkResultCommandInput,
  GetAlimtalkResultCommandOutput,
  SensClientResolvedConfig
> {
  input: GetAlimtalkResultCommandInput;
  serializer: RequestSerializer<GetAlimtalkResultCommandInput, SensClientResolvedConfig>;
  deserializer: ResponseDeserializer<GetAlimtalkResultCommandOutput, SensClientResolvedConfig>;
  constructor(input: GetAlimtalkResultCommandInput) {
    super(input);
    this.input = {
      messageId: input.messageId,
    };
    this.serializer = se_GetAlimtalkResultCommand;
    this.deserializer = de_GetAlimtalkResultCommand;
  }
}
