export interface ListAlimtalkTemplatesInput {
  channelId: string;
}

export interface ListAlimtalkTemplatesOutput {
  templates?: Template[];
}

export interface Template {
  createTime?: string;
  updateTime?: string;
  channelId?: string;
  templateCode?: string;
  templateName?: string;
  content?: string;
  comments?: Comment[];
  templateInspectionStatus?: string;
  templateStatus?: string;
  buttons?: Button[];
}

export interface Comment {
  commentId?: string;
  content?: string;
  status?: string;
  createTime?: string;
}

export interface Button {
  order?: number;
  type?: string;
  name?: string;
  linkMobile?: string;
  linkPc?: string;
  schemeIos?: string;
  schemeAndroid?: string;
}
