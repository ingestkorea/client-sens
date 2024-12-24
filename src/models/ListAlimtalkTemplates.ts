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
}
