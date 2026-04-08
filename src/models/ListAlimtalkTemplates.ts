export interface ListAlimtalkTemplatesRequest {
  channelId: string;
}

// 주의: 포맷 맞추려고 수동으로 templates 변수 할당 >> 순수 response는 배열로 바로 넘어옴
export interface ListAlimtalkTemplatesResult {
  templates?: Template[];
}

export interface Template {
  createTime?: string;
  updateTime?: string;
  channelId?: string;
  templateCode?: string;
  templateName?: string;
}
