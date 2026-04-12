import { GetSMSStatusResult } from "./GetSMSStatus.js";

export interface ListSMSStatusRequest {
  requestStartTime?: string;
  requestEndTime?: string;
  type?: "SMS" | "LMS" | "MMS";
  contentType?: "COMM" | "AD";
  status?: "READY" | "PROCESSING" | "COMPLETED";
  from?: string;
  to?: string;
  statusName?: "success" | "fail";
  pageSize?: number;
  // 1. requestStartTime, requestEndTime의 경우 사용자가 입력하지 않으면 API 호출 기준으로 자동 생성됨.
  // 2. nextToken 사용시 먼저 요청한 옵션들 모두 동일해야됨 (ex. requestStartTime, requestEndTime, pageSize ...)
  nextToken?: string;
}

export interface ListSMSStatusResult extends GetSMSStatusResult {}
