export interface GetSMSStatusRequest {
  requestId: string;
  pageSize?: number;
  nextToken?: string;
}

export interface GetSMSStatusResult {
  requestId?: string;
  statusCode?: string;
  statusName?: string;
  messages?: SMSMessageRequestStatus[];
  pageSize?: number;
  pageIndex?: number;
  itemCount?: number;
  hasMore?: boolean;
  nextToken?: string;
}

export interface SMSMessageRequestStatus {
  requestId?: string;
  messageId?: string;
  requestTime?: string;
  contentType?: string;
  type?: string;
  countryCode?: string;
  from?: string;
  to?: string;
  completeTime?: string;
  telcoCode?: string;
  status?: string;
  statusCode?: string;
  statusName?: string;
  statusMessage?: string;
}
