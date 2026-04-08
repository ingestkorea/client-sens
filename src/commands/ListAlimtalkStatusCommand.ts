import {
  SensClientResolvedConfig,
  SensCommand,
  ListAlimtalkStatusRequest,
  ListAlimtalkStatusResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_ListAlimtalkStatusCommand, de_ListAlimtalkStatusCommand } from "../protocols/ListAlimtalkStatus.js";

export interface ListAlimtalkStatusCommandInput extends ListAlimtalkStatusRequest {}
export interface ListAlimtalkStatusCommandOutput extends MetadataBearer, ListAlimtalkStatusResult {}

const KST_OFFSET = 9 * 60 * 60 * 1000;
const DURATION_LIMIT = 24 * 60 * 60 * 1000;

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

export class ListAlimtalkStatusCommand extends SensCommand<
  ListAlimtalkStatusCommandInput,
  ListAlimtalkStatusCommandOutput,
  SensClientResolvedConfig
> {
  input: ListAlimtalkStatusCommandInput;
  serializer: RequestSerializer<ListAlimtalkStatusCommandInput, SensClientResolvedConfig>;
  deserializer: ResponseDeserializer<ListAlimtalkStatusCommandOutput, SensClientResolvedConfig>;
  constructor(input: ListAlimtalkStatusCommandInput) {
    super(input);
    const { startTime, endTime } = getDefaultRequestDurationKST({ durationLimit: DURATION_LIMIT });
    this.input = {
      plusFriendId: input.plusFriendId,
      requestStartTime: input.requestStartTime ? input.requestStartTime : startTime,
      requestEndTime: input.requestEndTime ? input.requestEndTime : endTime,
      pageSize: Math.min(MAX_LIMIT, Math.max(1, input.pageSize ?? DEFAULT_LIMIT)),
      ...(input.requestStatusName && { requestStatusName: input.requestStatusName }),
      ...(input.messageStatusName && { messageStatusName: input.messageStatusName }),
      ...(input.requestId && { requestId: input.requestId }),
      ...(input.messageId && { messageId: input.messageId }),
      ...(input.templateCode && { templateCode: input.templateCode }),
      ...(input.to && { to: input.to.replace(/\-/gi, "") }),
      ...(input.nextToken && { nextToken: input.nextToken }),
    };
    this.serializer = se_ListAlimtalkStatusCommand;
    this.deserializer = de_ListAlimtalkStatusCommand;
  }
}

const getDefaultRequestDurationKST = (config: { durationLimit: number }): { startTime: string; endTime: string } => {
  const now = new Date().getTime() + KST_OFFSET;

  return {
    startTime: new Date(now - config.durationLimit).toISOString().replace(/\.\d{3}Z$/, ""),
    endTime: new Date(now).toISOString().replace(/\.\d{3}Z$/, ""),
  };
};
