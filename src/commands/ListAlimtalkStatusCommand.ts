import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { SensCommand, ListAlimtalkStatusInput, ListAlimtalkStatusOutput, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import {
  serializeIngestkorea_restJson_ListAlimtalkStatusCommand,
  deserializeIngestkorea_restJson_ListAlimtalkStatusCommand,
} from "../protocols/ListAlimtalkStatus";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";
import { getRequestDuration } from "./constants";

export interface ListAlimtalkStatusCommandInput extends ListAlimtalkStatusInput {}
export interface ListAlimtalkStatusCommandOutput extends ListAlimtalkStatusOutput, MetadataBearer {}

export class ListAlimtalkStatusCommand extends SensCommand<
  ListAlimtalkStatusCommandInput,
  ListAlimtalkStatusCommandOutput,
  SensClientResolvedConfig
> {
  input: ListAlimtalkStatusCommandInput;
  constructor(input: ListAlimtalkStatusCommandInput) {
    super(input);
    const { startTime, endTime } = getRequestDuration();
    this.input = {
      plusFriendId: input.plusFriendId,
      ...(input.requestId && { requestId: input.requestId }),
      ...(input.messageId && { messageId: input.messageId }),
      ...(input.requestStatusName && { requestStatusName: input.requestStatusName }),
      ...(input.messageStatusName && { messageStatusName: input.messageStatusName }),
      ...(input.templateCode && { templateCode: input.templateCode }),
      ...(input.to && { to: input.to.replace(/\-/gi, "") }),
      requestStartTime: input.requestStartTime ? input.requestStartTime : startTime,
      requestEndTime: input.requestEndTime ? input.requestEndTime : endTime,
      pageIndex: input.pageIndex ? input.pageIndex : 0,
      pageSize: input.pageSize && input.pageSize <= 100 ? input.pageSize : 20,
    };
  }
  async serialize(input: ListAlimtalkStatusCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    if (!config.serviceId.kakao)
      throw new IngestkoreaError({
        code: 400,
        type: "Bad Request",
        message: "Invalid Params",
        description: "Please Check Kakao ServiceId",
      });
    let request = await serializeIngestkorea_restJson_ListAlimtalkStatusCommand(input, config);
    return request;
  }
  async deserialize(response: {
    response: HttpResponse;
    output: MetadataBearer;
  }): Promise<ListAlimtalkStatusCommandOutput> {
    let output = await deserializeIngestkorea_restJson_ListAlimtalkStatusCommand(response);
    return output;
  }
}
