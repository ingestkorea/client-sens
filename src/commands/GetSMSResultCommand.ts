import {
  SensClientResolvedConfig,
  SensCommand,
  GetSMSResultRequest,
  GetSMSResultResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_GetSMSResultCommand, de_GetSMSResultCommand } from "../protocols/GetSMSResult.js";

export interface GetSMSResultCommandInput extends GetSMSResultRequest {}
export interface GetSMSResultCommandOutput extends MetadataBearer, GetSMSResultResult {}

export class GetSMSResultCommand extends SensCommand<
  GetSMSResultCommandInput,
  GetSMSResultCommandOutput,
  SensClientResolvedConfig
> {
  input: GetSMSResultCommandInput;
  serializer: RequestSerializer<GetSMSResultCommandInput, SensClientResolvedConfig>;
  deserializer: ResponseDeserializer<GetSMSResultCommandOutput, SensClientResolvedConfig>;
  constructor(input: GetSMSResultCommandInput) {
    super(input);
    this.input = {
      messageId: input.messageId,
    };
    this.serializer = se_GetSMSResultCommand;
    this.deserializer = de_GetSMSResultCommand;
  }
}
