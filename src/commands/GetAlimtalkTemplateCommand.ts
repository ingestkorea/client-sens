import {
  SensClientResolvedConfig,
  SensCommand,
  GetAlimtalkTemplateRequest,
  GetAlimtalkTemplateResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_GetAlimtalkTemplateCommand, de_GetAlimtalkTemplateCommand } from "../protocols/GetAlimtalkTemplate.js";

export interface GetAlimtalkTemplateCommandInput extends GetAlimtalkTemplateRequest {}
export interface GetAlimtalkTemplateCommandOutput extends MetadataBearer, GetAlimtalkTemplateResult {}

export class GetAlimtalkTemplateCommand extends SensCommand<
  GetAlimtalkTemplateCommandInput,
  GetAlimtalkTemplateCommandOutput,
  SensClientResolvedConfig
> {
  input: GetAlimtalkTemplateCommandInput;
  serializer: RequestSerializer<GetAlimtalkTemplateCommandInput, SensClientResolvedConfig>;
  deserializer: ResponseDeserializer<GetAlimtalkTemplateCommandOutput, SensClientResolvedConfig>;
  constructor(input: GetAlimtalkTemplateCommandInput) {
    super(input);
    this.input = {
      channelId: input.channelId,
      templateCode: input.templateCode,
    };
    this.serializer = se_GetAlimtalkTemplateCommand;
    this.deserializer = de_GetAlimtalkTemplateCommand;
  }
}
