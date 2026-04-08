import { SendSMSRequest, SendSMSResult } from "./SendSMS.js";

export const MMS_MAX_SUPPORT_FILE_SIZE = 300; // KiByte
export const MMS_SUPPORT_FILE_EXTENSION = [".jpg", ".jpeg"];

export type SendFile = {
  name: string;
  body?: string;
};

export interface SendMMSRequest extends SendSMSRequest {
  files: SendFile[];
}

export interface SendMMSResult extends SendSMSResult {}
