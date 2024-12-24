import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { ListAlimtalkTemplatesOutput, Template, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import {
  ListAlimtalkTemplatesCommandInput,
  ListAlimtalkTemplatesCommandOutput,
} from "../commands/ListAlimtalkTemplatesCommand";
import { parseBody, parseErrorBody, deserializeMetadata } from "./constants";

export const serializeIngestkorea_restJson_ListAlimtalkTemplatesCommand = async (
  input: ListAlimtalkTemplatesCommandInput,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/alimtalk/v2/services/" + config.serviceId.kakao + "/templates";
  const headers = {
    host: hostname,
  };
  const query = {
    channelId: input.channelId,
  };
  return new HttpRequest({
    protocol: "https:",
    method: "GET",
    hostname: hostname,
    path: path,
    query: query,
    headers: headers,
  });
};

export const deserializeIngestkorea_restJson_ListAlimtalkTemplatesCommand = async (response: {
  response: HttpResponse;
  output: MetadataBearer;
}): Promise<ListAlimtalkTemplatesCommandOutput> => {
  const { response: httpResponse, output } = response;
  if (httpResponse.statusCode > 300) await parseErrorBody(httpResponse);

  const data: any = await parseBody(httpResponse); // ListAlimtalkTemplatesOutput
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_ListAlimtalkTemplatesOutput(data);

  return {
    $metadata: {
      ...deserializeMetadata(httpResponse),
      ...output.$metadata,
    },
    ...contents,
  };
};

export const deserializeIngestkorea_restJson_ListAlimtalkTemplatesOutput = async (
  output: any[]
): Promise<ListAlimtalkTemplatesOutput> => {
  return {
    templates: deserializeIngestkorea_restJson_AlimtalkTemplates(output),
  };
};

export const deserializeIngestkorea_restJson_AlimtalkTemplates = (outputs: any[]): Template[] => {
  let result = outputs.map(parseTemplate);
  return result;
};

export const parseTemplate = (output: any): Template => {
  return {
    createTime: output.createTime != undefined ? output.createTime : undefined,
    updateTime: output.updateTime != undefined ? output.updateTime : undefined,
    channelId: output.channelId != undefined ? output.channelId : undefined,
    templateCode: output.templateCode != undefined ? output.templateCode : undefined,
    templateName: output.templateName != undefined ? output.templateName : undefined,
  };
};
