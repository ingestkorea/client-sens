import { ReceivedMessage } from './SendAlimtalk';

export interface GetRequestStatusInput {
  requestId: string
};

export interface GetRequestStatusOutput {
  requestId?: string
  statusCode?: string,
  statusName?: string,
  messages?: StatusMessage[]
};

export interface StatusMessage extends ReceivedMessage {
  requestTime?: string
  plusFriendId?: string
  templateCode?: string
  completeTime?: string
  messageStatusCode?: string
  messageStatusName?: string
  messageStatusDesc?: string
};