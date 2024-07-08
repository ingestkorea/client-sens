export interface GetSMSStatusInput {
  requestId: string;
}

export interface GetSMSStatusOutput {
  requestId?: string;
  statusCode?: string;
  statusName?: string;
  messages?: SMSStatusMessage[];
}

export interface SMSStatusMessage {
  messageId?: string;
  requestTime?: string;
  contentType?: string;
  countryCode?: string;
  from?: string;
  to?: string;
}
