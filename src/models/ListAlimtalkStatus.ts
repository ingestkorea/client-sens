import { GetAlimtalkStatusOutput } from "./GetAlimtalkStatus";

export interface ListAlimtalkStatusInput {
  plusFriendId: string;
  requestId?: string;
  messageId?: string;
  requestStartTime?: string;
  requestEndTime?: string;
  requestStatusName?: "success" | "fail";
  messageStatusName?: "success" | "fail" | "processing";
  templateCode?: string;
  to?: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface ListAlimtalkStatusOutput extends GetAlimtalkStatusOutput {}
