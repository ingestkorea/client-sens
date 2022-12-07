export interface ListChannelsInput {

};

export interface ListChannelsOutput {
  channels: Channel[]
};

export interface Channel {
  createTime?: string
  updateTime?: string
  serviceId?: string
  channelId?: string
  channelName?: string
  channelStatus?: string
  useSmsFailover?: string
};