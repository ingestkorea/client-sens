export interface GetSMSStatusRequest {
  requestId: string;
}

export interface GetSMSStatusResult {
  requestId?: string;
  statusCode?: string;
  statusName?: string;
  messages?: SMSMessageRequestStatus[];
}

export interface SMSMessageRequestStatus {
  messageId?: string;
  requestTime?: string;
  contentType?: string;
  countryCode?: string;
  from?: string;
  to?: string;
}
