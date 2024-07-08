import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { GetAlimtalkTemplateOutput } from "../models/GetAlimtalkTemplate";
import { SensClientResolvedConfig } from "../SensClient";
import {
  GetAlimtalkTemplateCommandInput,
  GetAlimtalkTemplateCommandOutput,
} from "../commands/GetAlimtalkTemplateCommand";
import { deserializeIngestkorea_restJson_AlimtalkTemplate } from "./ListAlimtalkTemplates";
import { parseBody, parseErrorBody } from "./constants";

export const serializeIngestkorea_restJson_GetAlimtalkTemplateCommand = async (
  input: GetAlimtalkTemplateCommandInput,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/alimtalk/v2/services/" + config.serviceId.kakao + "/templates";
  const headers = {
    host: hostname,
  };
  const query = {
    channelId: input.channelId,
    templateCode: input.templateCode,
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

export const deserializeIngestkorea_restJson_GetAlimtalkTemplateCommand = async (
  output: HttpResponse
): Promise<GetAlimtalkTemplateCommandOutput> => {
  if (output.statusCode > 300) await parseErrorBody(output);

  const data: any = await parseBody(output); // GetAlimtalkTemplateOutput
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_GetAlimtalkTemplateOutput(data);

  const response: GetAlimtalkTemplateCommandOutput = {
    ...contents,
  };
  return response;
};

export const deserializeIngestkorea_restJson_GetAlimtalkTemplateOutput = async (
  output: any
): Promise<GetAlimtalkTemplateOutput> => {
  return {
    templates: deserializeIngestkorea_restJson_AlimtalkTemplate(output),
  };
};
