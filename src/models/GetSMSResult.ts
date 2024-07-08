export interface GetSMSResultInput {
  messageId: string;
}

export interface GetSMSResultOutput {
  statusCode?: string;
  statusName?: string;
  messages?: SMSResultMessage[];
}

export interface SMSResultMessage {
  requestTime?: string;
  contentType?: string;
  content?: string;
  countryCode?: string;
  from?: string;
  to?: string;
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
