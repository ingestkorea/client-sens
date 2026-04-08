import { SensClientResolvedConfig, RequestSerializer, ResponseDeserializer } from "../models/index.js";
import { SendMMSCommandInput, SendMMSCommandOutput } from "../commands/SendMMSCommand.js";
import { se_SendSMSCommand, de_SendSMSCommand } from "./SendSMS.js";

export const se_SendMMSCommand: RequestSerializer<SendMMSCommandInput, SensClientResolvedConfig> = async (
  input,
  config
) => {
  return se_SendSMSCommand(input, config);
};

export const de_SendMMSCommand: ResponseDeserializer<SendMMSCommandOutput, SensClientResolvedConfig> = async (
  response,
  config
) => {
  return de_SendSMSCommand(response, config);
};
