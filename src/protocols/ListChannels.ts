import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { ListChannelsOutput, Channel } from '../models/ListChannels';
import { SensClientResolvedConfig } from '../SensClient';
import {
  ListChannelsCommandInput,
  ListChannelsCommandOutput
} from '../commands/ListChannelsCommand';
import { parseBody, parseErrorBody } from './constants';

export const serializeIngestkorea_restJson_ListChannelsCommand = async (
  input: ListChannelsCommandInput,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/alimtalk/v2/services/" + config.serviceId.kakao + "/channels";
  const headers = {
    "host": hostname
  };
  return new HttpRequest({
    protocol: 'https:',
    method: 'GET',
    hostname: hostname,
    path: path,
    headers: headers
  });
};

export const deserializeIngestkorea_restJson_ListChannelsCommand = async (
  output: HttpResponse
): Promise<ListChannelsCommandOutput> => {
  if (output.statusCode > 300) await parseErrorBody(output);

  const data: any = await parseBody(output); // ListChannelsOutput
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_ListChannelsOutput(data);

  const response: ListChannelsCommandOutput = {
    ...contents
  };
  return response;
};

export const deserializeIngestkorea_restJson_ListChannelsOutput = async (
  outputs: any[]
): Promise<ListChannelsOutput> => {
  return {
    channels: deserializeIngestkorea_restJson_ListChannelsChannelInfo(outputs)
  };
};

export const deserializeIngestkorea_restJson_ListChannelsChannelInfo = (
  outputs: any[]
): Channel[] => {
  const result: Channel[] = outputs.map(output => {
    return {
      createTime: output.createTime != undefined ? output.createTime : undefined,
      updateTime: output.updateTime != undefined ? output.updateTime : undefined,
      serviceId: output.serviceId != undefined ? output.serviceId : undefined,
      channelId: output.channelId != undefined ? output.channelId : undefined,
      channelName: output.channelName != undefined ? output.channelName : undefined,
      channelStatus: output.channelStatus != undefined ? output.channelStatus : undefined,
      useSmsFailover: output.useSmsFailover != undefined ? output.useSmsFailover : undefined
    };
  });
  return result;
};