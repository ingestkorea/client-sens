import { SMSMessageRequestStatus } from "./GetSMSStatus.js";

export interface GetSMSResultRequest {
  messageId: string;
}

export interface GetSMSResultResult {
  statusCode?: string;
  statusName?: string;
  messages?: SMSMessageStatus[];
}

export interface SMSMessageStatus extends SMSMessageRequestStatus {
  content?: string;
  status?: string;
  statusCode?: string;
  statusMessage?: string;
  statusName?: string;
  completeTime?: string;
  telcoCode?: string;
  files?: File[];
}

export interface File {
  name?: string;
}
