import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  SensClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  ListAlimtalkChannelsResult,
  AlimtalkChannel,
} from "../models/index.js";
import {
  ListAlimtalkChannelsCommandInput,
  ListAlimtalkChannelsCommandOutput,
} from "../commands/ListAlimtalkChannelsCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";

export const se_ListAlimtalkChannelsCommand: RequestSerializer<
  ListAlimtalkChannelsCommandInput,
  SensClientResolvedConfig
> = async (input, config) => {
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

export const de_ListAlimtalkChannelsCommand: ResponseDeserializer<
  ListAlimtalkChannelsCommandOutput,
  SensClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_ListAlimtalkChannelsResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_ListAlimtalkChannelsResult = (output: any): ListAlimtalkChannelsResult => {
  return {
    channels: output.channels ? de_AlimtalkChannelList(output.channels) : [],
  };
};

const de_AlimtalkChannelList = (output: any[]): AlimtalkChannel[] => {
  return (output || []).filter((e) => e != null).map((entry) => de_AlimtalkChannel(entry));
};

const de_AlimtalkChannel = (output: any): AlimtalkChannel => {
  return {
    createTime: output.createTime != undefined ? output.createTime : undefined,
    updateTime: output.updateTime != undefined ? output.updateTime : undefined,
    serviceId: output.serviceId != undefined ? output.serviceId : undefined,
    channelId: output.channelId != undefined ? output.channelId : undefined,
    channelName: output.channelName != undefined ? output.channelName : undefined,
    channelStatus: output.channelStatus != undefined ? output.channelStatus : undefined,
    useSmsFailover: output.useSmsFailover != undefined ? output.useSmsFailover : undefined,
  };
};
