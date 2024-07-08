import { StatusMessage } from "./GetAlimtalkStatus";

export interface GetAlimtalkResultInput {
  messageId: string;
}
export interface GetAlimtalkResultOutput extends StatusMessage {
  requestId?: string;
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
