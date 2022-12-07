import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { GetTemplateOutput } from '../models/GetTemplate';
import { SensClientResolvedConfig } from '../SensClient';
import {
  GetTemplateCommandInput,
  GetTemplateCommandOutput
} from '../commands/GetTemplateCommand';
import { deserializeIngestkorea_restJson_Template } from '../protocols/ListTemplates';
import { parseBody, parseErrorBody } from './constants';

export const serializeIngestkorea_restJson_GetTemplateCommand = async (
  input: GetTemplateCommandInput,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/alimtalk/v2/services/" + config.serviceId.kakao + "/templates";
  const headers = {
    "host": hostname
  };
  const query = {
    channelId: input.channelId,
    templateCode: input.templateCode
  };
  return new HttpRequest({
    protocol: 'https:',
    method: 'GET',
    hostname: hostname,
    path: path,
    query: query,
    headers: headers
  });
};

export const deserializeIngestkorea_restJson_GetTemplateCommand = async (
  output: HttpResponse
): Promise<GetTemplateCommandOutput> => {
  if (output.statusCode > 300) await parseErrorBody(output);

  const data: any = await parseBody(output); // GetTemplateOutput
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_GetTemplateOutput(data);

  const response: GetTemplateCommandOutput = {
    ...contents
  };
  return response;
};

export const deserializeIngestkorea_restJson_GetTemplateOutput = async (
  output: any
): Promise<GetTemplateOutput> => {
  return {
    templates: deserializeIngestkorea_restJson_Template(output)
  };
};