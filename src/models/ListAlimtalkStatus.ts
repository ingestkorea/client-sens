import { GetAlimtalkStatusResult } from "./GetAlimtalkStatus.js";

export interface ListAlimtalkStatusRequest {
  plusFriendId: string;
  requestStartTime?: string;
  requestEndTime?: string;
  pageSize?: number;
  requestStatusName?: "success" | "fail";
  messageStatusName?: "success" | "processing" | "fail";
  requestId?: string;
  messageId?: string;
  templateCode?: string;
  to?: string;
  // 1. requestStartTime, requestEndTime의 경우 사용자가 입력하지 않으면 API 호출 기준으로 자동 생성됨.
  // 2. nextToken 사용시 먼저 요청한 옵션들 모두 동일해야됨 (ex. requestStartTime, requestEndTime, pageSize ...)
  nextToken?: string;
}

export interface ListAlimtalkStatusResult extends GetAlimtalkStatusResult {}
