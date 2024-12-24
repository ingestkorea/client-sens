import { TemplateButton } from "./SendAlimtalk";

export interface GetAlimtalkTemplateInput {
  channelId: string;
  templateCode: string;
}

export interface GetAlimtalkTemplateOutput {
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
  buttons?: TemplateButtons[];
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

export interface TemplateButtons extends Partial<TemplateButton> {
  order?: number;
}
