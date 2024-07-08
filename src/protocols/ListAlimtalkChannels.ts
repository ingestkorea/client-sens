import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { ListAlimtalkChannelsOutput, Channel } from "../models/ListAlimtalkChannels";
import { SensClientResolvedConfig } from "../SensClient";
import {
  ListAlimtalkChannelsCommandInput,
  ListAlimtalkChannelsCommandOutput,
} from "../commands/ListAlimtalkChannelsCommand";
import { parseBody, parseErrorBody } from "./constants";

export const serializeIngestkorea_restJson_ListAlimtalkChannelsCommand = async (
  input: ListAlimtalkChannelsCommandInput,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/alimtalk/v2/services/" + config.serviceId.kakao + "/channels";
  const headers = {
    host: hostname,
  };
  return new HttpRequest({
    protocol: "https:",
    method: "GET",
    hostname: hostname,
    path: path,
    headers: headers,
  });
};

export const deserializeIngestkorea_restJson_ListAlimtalkChannelsCommand = async (
  output: HttpResponse
): Promise<ListAlimtalkChannelsCommandOutput> => {
  if (output.statusCode > 300) await parseErrorBody(output);

  const data: any = await parseBody(output); // ListAlimtalkChannelsOutput
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_ListAlimtalkChannelsOutput(data);

  const response: ListAlimtalkChannelsOutput = {
    ...contents,
  };
  return response;
};

export const deserializeIngestkorea_restJson_ListAlimtalkChannelsOutput = async (
  outputs: any[]
): Promise<ListAlimtalkChannelsOutput> => {
  return {
    channels: deserializeIngestkorea_restJson_Channel(outputs),
  };
};

export const deserializeIngestkorea_restJson_Channel = (outputs: any[]): Channel[] => {
  const result: Channel[] = outputs.map((output) => {
    return {
      createTime: output.createTime != undefined ? output.createTime : undefined,
      updateTime: output.updateTime != undefined ? output.updateTime : undefined,
      serviceId: output.serviceId != undefined ? output.serviceId : undefined,
      channelId: output.channelId != undefined ? output.channelId : undefined,
      channelName: output.channelName != undefined ? output.channelName : undefined,
      channelStatus: output.channelStatus != undefined ? output.channelStatus : undefined,
      useSmsFailover: output.useSmsFailover != undefined ? output.useSmsFailover : undefined,
    };
  });
  return result;
};
