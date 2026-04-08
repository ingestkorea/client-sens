import {
  SensClientResolvedConfig,
  SensCommand,
  ListAlimtalkChannelsRequest,
  ListAlimtalkChannelsResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_ListAlimtalkChannelsCommand, de_ListAlimtalkChannelsCommand } from "../protocols/ListAlimtalkChannels.js";

export interface ListAlimtalkChannelsCommandInput extends ListAlimtalkChannelsRequest {}
export interface ListAlimtalkChannelsCommandOutput extends MetadataBearer, ListAlimtalkChannelsResult {}

export class ListAlimtalkChannelsCommand extends SensCommand<
  ListAlimtalkChannelsCommandInput,
  ListAlimtalkChannelsCommandOutput,
  SensClientResolvedConfig
> {
  input: ListAlimtalkChannelsCommandInput;
  serializer: RequestSerializer<ListAlimtalkChannelsCommandInput, SensClientResolvedConfig>;
  deserializer: ResponseDeserializer<ListAlimtalkChannelsCommandOutput, SensClientResolvedConfig>;
  constructor(input: ListAlimtalkChannelsCommandInput) {
    super(input);
    this.input = {};
    this.serializer = se_ListAlimtalkChannelsCommand;
    this.deserializer = de_ListAlimtalkChannelsCommand;
  }
}
