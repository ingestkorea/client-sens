import { TemplateButton } from "./SendAlimtalk.js";

export interface GetAlimtalkTemplateRequest {
  channelId: string;
  templateCode: string;
}

// 주의: 포맷 맞추려고 수동으로 templates 변수 할당 >> 순수 response는 배열로 바로 넘어옴
export interface GetAlimtalkTemplateResult {
  templates?: TemplateDetail[];
}

export interface TemplateDetail {
  createTime?: string;
  updateTime?: string;
  channelId?: string;
  templateCode?: string;
  templateName?: string;
  categoryCode?: string;
  categoryName?: string;
  messageType?: string;
  emphasizeType?: string;
  content?: string;
  adContent?: string;
  extraContent?: string;
  title?: string;
  additionalTitle?: string;
  comments?: Comment[];
  templateInspectionStatus?: string;
  templateStatus?: string;
  buttons?: TemplateButtonExtend[];
  securityFlag?: boolean;
  isBlock?: boolean;
  isDormant?: boolean;
}

export interface Comment {
  commentId?: string;
  content?: string;
  status?: string;
  createTime?: string;
  attachment?: Attachment[];
}

export interface Attachment {
  fileName?: string;
  fileUrl?: string;
}

export interface TemplateButtonExtend extends Partial<TemplateButton> {
  order?: number;
}
