import { AlimtalkMessageStatus } from "./GetAlimtalkStatus.js";

export interface GetAlimtalkResultRequest {
  messageId: string;
}
export interface GetAlimtalkResultResult extends AlimtalkMessageStatus {
  failover?: Failover;
}

export interface Failover {
  smsServiceId?: string;
  requestId?: string;
  requestStatusCode?: string;
  requestStatusName?: string;
  requestStatusDesc?: string;
  messageId?: string;
  messageStatus?: string;
  messageStatusCode?: string;
  messageStatusName?: string;
  messageStatusDesc?: string;
}
