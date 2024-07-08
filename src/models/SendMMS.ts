import { SendSMSInput, SendSMSOutput } from "./SendSMS";

export type SendFile = {
  name: string;
  body?: string;
};

export interface SendMMSInput extends SendSMSInput {
  files: SendFile[];
}

export interface SendMMSOutput extends SendSMSOutput {}
