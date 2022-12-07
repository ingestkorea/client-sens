export interface SendAlimtalkInput {
  plusFriendId: string
  templateCode: string
  messages: AlimtalkMessage[]
};
export interface SendAlimtalkOutput {
  requestId?: string
  requestTime?: string
  statusCode?: string,
  statusName?: string,
  messages?: ReceivedMessage[]
};

export interface AlimtalkMessage {
  to: string
  content: string
  buttons?: Buttons[]
};
export interface Buttons {
  type: string
  name: string
  linkMobile: string
  linkPc: string
};

export interface ReceivedMessage {
  messageId?: string
  to?: string
  countryCode?: string
  content?: string
  requestStatusCode?: string
  requestStatusName?: string
  requestStatusDesc?: string
  useSmsFailover?: boolean
};