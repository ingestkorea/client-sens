import { ReceivedMessage } from './SendAlimtalk';

export interface GetAlimtalkStatusInput {
  requestId: string
};

export interface GetAlimtalkStatusOutput {
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