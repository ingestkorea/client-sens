export const ALIMTALK_MAX_RECIPIENTS = 100;
export const ALIMTALK_MAX_CONTENT_LENGTH = 1000;

export interface SendAlimtalkRequest {
  plusFriendId: string;
  templateCode: string;
  messages: AlimtalkMessage[];
}

export interface SendAlimtalkResult {
  requestId?: string;
  requestTime?: string;
  statusCode?: string;
  statusName?: string;
  messages?: AlimtalkMessageRequestStatus[];
}

export interface AlimtalkMessage {
  to: string;
  content: string;
  useSmsFailover?: boolean;
  buttons?: TemplateButton[];
}

export interface TemplateButton {
  type: AlimtalkButtonType;
  name: AlimtalkButtonName;
  linkMobile?: string;
  linkPc?: string;
  schemeIos?: string;
  schemeAndroid?: string;
}

const ALIMTALK_BUTTON_TYPES = ["DS", "WL", "AL", "BK", "MD", "AC"] as const;
const ALIMTALK_BUTTON_NAMES = ["배송 조회", "웹 링크", "앱 링크", "봇 키워드", "메시지 전달", "채널 추가"] as const;

export type AlimtalkButtonType = (typeof ALIMTALK_BUTTON_TYPES)[number];
export type AlimtalkButtonName = (typeof ALIMTALK_BUTTON_NAMES)[number];

export interface AlimtalkMessageRequestStatus {
  messageId?: string;
  to?: string;
  countryCode?: string;
  content?: string;
  requestStatusCode?: string;
  requestStatusName?: string;
  requestStatusDesc?: string;
  useSmsFailover?: boolean;
}
