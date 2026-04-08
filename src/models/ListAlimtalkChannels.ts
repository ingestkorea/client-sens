export interface ListAlimtalkChannelsRequest {}

export interface ListAlimtalkChannelsResult {
  channels: AlimtalkChannel[];
}

export interface AlimtalkChannel {
  createTime?: string;
  updateTime?: string;
  serviceId?: string;
  channelId?: string;
  channelName?: string;
  channelStatus?: string;
  useSmsFailover?: string;
}
