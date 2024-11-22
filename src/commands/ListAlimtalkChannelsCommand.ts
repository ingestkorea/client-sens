import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { SensCommand, ListAlimtalkChannelsInput, ListAlimtalkChannelsOutput, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import {
  serializeIngestkorea_restJson_ListAlimtalkChannelsCommand,
  deserializeIngestkorea_restJson_ListAlimtalkChannelsCommand,
} from "../protocols/ListAlimtalkChannels";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";

export interface ListAlimtalkChannelsCommandInput extends ListAlimtalkChannelsInput {}
export interface ListAlimtalkChannelsCommandOutput extends ListAlimtalkChannelsOutput, MetadataBearer {}

export class ListAlimtalkChannelsCommand extends SensCommand<
  ListAlimtalkChannelsCommandInput,
  ListAlimtalkChannelsCommandOutput,
  SensClientResolvedConfig
> {
  input: ListAlimtalkChannelsCommandInput;
  constructor(input: ListAlimtalkChannelsCommandInput) {
    super(input);
    this.input = {
      ...input,
    };
  }
  async serialize(input: ListAlimtalkChannelsCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    if (!config.serviceId.kakao)
      throw new IngestkoreaError({
        code: 400,
        type: "Bad Request",
        message: "Invalid Params",
        description: "Please Check Kakao ServiceId",
      });
    let request = await serializeIngestkorea_restJson_ListAlimtalkChannelsCommand(input, config);
    return request;
  }
  async deserialize(response: {
    response: HttpResponse;
    output: MetadataBearer;
  }): Promise<ListAlimtalkChannelsCommandOutput> {
    let output = await deserializeIngestkorea_restJson_ListAlimtalkChannelsCommand(response);
    return output;
  }
}
