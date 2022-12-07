import { StatusMessage } from './GetRequestStatus';

export interface GetRequestResultInput {
  messageId: string
};
export interface GetRequestResultOutput extends StatusMessage {
  requestId?: string,
  failover?: Failover
};

export interface Failover {
  smsServiceId?: string,
  requestId?: string,
  requestStatusCode?: string
  requestStatusName?: string
  requestStatusDesc?: string
  messageId?: string,
  messageStatus?: string,
  messageStatusCode?: string
  messageStatusName?: string
  messageStatusDesc?: string
};