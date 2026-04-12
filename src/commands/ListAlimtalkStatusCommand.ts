import {
  SensClientResolvedConfig,
  SensCommand,
  ListAlimtalkStatusRequest,
  ListAlimtalkStatusResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
  SensError,
} from "../models/index.js";
import { se_ListAlimtalkStatusCommand, de_ListAlimtalkStatusCommand } from "../protocols/ListAlimtalkStatus.js";
import {
  getDefaultRequestDuration,
  resolveRequestDuration,
  convertToUtc,
  convertToKst,
  prettyPhoneNum,
} from "./constants.js";

export interface ListAlimtalkStatusCommandInput extends ListAlimtalkStatusRequest {}
export interface ListAlimtalkStatusCommandOutput extends MetadataBearer, ListAlimtalkStatusResult {}

const DURATION_LIMIT_MS = 30 * 24 * 3_600_000; // 30일 이내만 조회 가능

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
    if (input.nextToken && (!input.requestStartTime || !input.requestEndTime)) {
      throw new SensError({
        code: 400,
        type: "Bad Request",
        message: "페이지네이션 검색 조건 불일치",
        invalidInputs: [
          {
            type: "not-valid.args",
            message:
              "nextToken 사용 시 데이터 일관성을 위해 최초 요청 시의 옵션(requestStartTime, requestEndTime, pageSize 등)이 모두 동일하게 유지되어야 합니다.",
          },
        ],
      });
    }

    const defaultDuration = getDefaultRequestDuration({ durationLimitMs: DURATION_LIMIT_MS });
    const { startTimeMs, endTimeMs } = resolveRequestDuration(
      {
        startTime: input.requestStartTime ? convertToUtc(input.requestStartTime) : defaultDuration.startTime,
        endTime: input.requestEndTime ? convertToUtc(input.requestEndTime) : defaultDuration.endTime,
      },
      { durationLimitMs: DURATION_LIMIT_MS }
    );

    this.input = {
      plusFriendId: input.plusFriendId,
      requestStartTime: convertToKst(startTimeMs),
      requestEndTime: convertToKst(endTimeMs),
      pageSize: Math.min(MAX_LIMIT, Math.max(1, input.pageSize ?? DEFAULT_LIMIT)),
      ...(input.requestStatusName && { requestStatusName: input.requestStatusName }),
      ...(input.messageStatusName && { messageStatusName: input.messageStatusName }),
      ...(input.requestId && { requestId: input.requestId, pageSize: MAX_LIMIT }),
      ...(input.messageId && { messageId: input.messageId }),
      ...(input.templateCode && { templateCode: input.templateCode }),
      ...(input.to && { to: prettyPhoneNum(input.to) }),
      ...(input.nextToken && { nextToken: input.nextToken }),
    };
    this.serializer = se_ListAlimtalkStatusCommand;
    this.deserializer = de_ListAlimtalkStatusCommand;
  }
}
