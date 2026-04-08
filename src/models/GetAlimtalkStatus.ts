import { AlimtalkMessageRequestStatus } from "./SendAlimtalk.js";

export interface GetAlimtalkStatusRequest {
  requestId: string;
  pageSize?: number;
  nextToken?: string;
}

export interface GetAlimtalkStatusResult {
  requestId?: string;
  statusCode?: string;
  statusName?: string;
  messages?: AlimtalkMessageStatus[];
  pageSize?: number;
  pageIndex?: number;
  itemCount?: number;
  hasMore?: boolean;
  nextToken?: string;
}

export interface AlimtalkMessageStatus extends AlimtalkMessageRequestStatus {
  requestId?: string;
  requestTime?: string;
  plusFriendId?: string;
  templateCode?: string;
  completeTime?: string;
  messageStatusCode?: string;
  messageStatusName?: string;
  messageStatusDesc?: string;
}
