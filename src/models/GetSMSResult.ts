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
  subject?: string;
  content?: string;
  files?: File[];
}

export interface File {
  fileId?: string;
  name?: string;
}
