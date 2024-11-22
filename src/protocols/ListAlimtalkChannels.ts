import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { ListAlimtalkChannelsOutput, Channel, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import {
  ListAlimtalkChannelsCommandInput,
  ListAlimtalkChannelsCommandOutput,
} from "../commands/ListAlimtalkChannelsCommand";
import { parseBody, parseErrorBody, deserializeMetadata } from "./constants";

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

export const deserializeIngestkorea_restJson_ListAlimtalkChannelsCommand = async (response: {
  response: HttpResponse;
  output: MetadataBearer;
}): Promise<ListAlimtalkChannelsCommandOutput> => {
  const { response: httpResponse, output } = response;
  if (httpResponse.statusCode > 300) await parseErrorBody(httpResponse);

  const data: any = await parseBody(httpResponse); // ListAlimtalkChannelsOutput
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_ListAlimtalkChannelsOutput(data);

  return {
    $metadata: {
      ...deserializeMetadata(httpResponse),
      ...output.$metadata,
    },
    ...contents,
  };
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
