export type MessageType = 'SMS' | 'LMS';
export type MessageContentType = 'COMM' | 'AD';
export type CountryCode = '1' | '886' | '81' | '86' | '65' | '852' | '82';
export type SMSMessage = {
  to: string,
  subject?: string,
  content?: string
};

export interface SendSMSInput {
  from: string,
  content: string,
  messages: SMSMessage[]
  type?: MessageType,
  contentType?: MessageContentType,
  countryCode?: CountryCode,
  subject?: string,
};

export interface SendSMSOutput {
  requestId?: string,
  requestTime?: string,
  statusCode?: string,
  statusName?: string,
};