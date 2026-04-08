import {
  SensClientResolvedConfig,
  SensCommand,
  ListAlimtalkTemplatesRequest,
  ListAlimtalkTemplatesResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import {
  se_ListAlimtalkTemplatesCommand,
  de_ListAlimtalkTemplatesCommand,
} from "../protocols/ListAlimtalkTemplates.js";

export interface ListAlimtalkTemplatesCommandInput extends ListAlimtalkTemplatesRequest {}
export interface ListAlimtalkTemplatesCommandOutput extends MetadataBearer, ListAlimtalkTemplatesResult {}

export class ListAlimtalkTemplatesCommand extends SensCommand<
  ListAlimtalkTemplatesCommandInput,
  ListAlimtalkTemplatesCommandOutput,
  SensClientResolvedConfig
> {
  input: ListAlimtalkTemplatesCommandInput;
  serializer: RequestSerializer<ListAlimtalkTemplatesCommandInput, SensClientResolvedConfig>;
  deserializer: ResponseDeserializer<ListAlimtalkTemplatesCommandOutput, SensClientResolvedConfig>;
  constructor(input: ListAlimtalkTemplatesCommandInput) {
    super(input);
    this.input = {
      channelId: input.channelId,
    };
    this.serializer = se_ListAlimtalkTemplatesCommand;
    this.deserializer = de_ListAlimtalkTemplatesCommand;
  }
}
