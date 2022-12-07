import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { ListTemplatesOutput, Template, Comment, Button } from '../models/ListTemplates';
import { SensClientResolvedConfig } from '../SensClient';
import {
  ListTemplatesCommandInput,
  ListTemplatesCommandOutput
} from '../commands/ListTemplatesCommand';
import { parseBody, parseErrorBody } from './constants';

export const serializeIngestkorea_restJson_ListTemplatesCommand = async (
  input: ListTemplatesCommandInput,
  config: SensClientResolvedConfig
): Promise<HttpRequest> => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/alimtalk/v2/services/" + config.serviceId.kakao + "/templates";
  const headers = {
    "host": hostname
  };
  const query = {
    channelId: input.channelId
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

export const deserializeIngestkorea_restJson_ListTemplatesCommand = async (
  output: HttpResponse
): Promise<ListTemplatesCommandOutput> => {
  if (output.statusCode > 300) await parseErrorBody(output);

  const data: any = await parseBody(output); // ListTemplatesOutput
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_ListTemplatesOutput(data);

  const response: ListTemplatesCommandOutput = {
    ...contents
  };
  return response;
};

export const deserializeIngestkorea_restJson_ListTemplatesOutput = async (
  output: any
): Promise<ListTemplatesOutput> => {
  return {
    templates: deserializeIngestkorea_restJson_Template(output)
  };
};

export const deserializeIngestkorea_restJson_Template = (
  outputs: any[]
): Template[] => {
  return outputs.map(output => {
    return {
      createTime: output.createTime != undefined ? output.createTime : undefined,
      updateTime: output.updateTime != undefined ? output.updateTime : undefined,
      channelId: output.channelId != undefined ? output.channelId : undefined,
      templateCode: output.templateCode != undefined ? output.templateCode : undefined,
      templateName: output.templateName != undefined ? output.templateName : undefined,
      content: output.content != undefined ? output.content : undefined,
      comments: output.comments != undefined
        ? deserializeIngestkorea_restJson_Comment(output.comments) : undefined,
      templateInspectionStatus: output.templateInspectionStatus != undefined
        ? output.templateInspectionStatus : undefined,
      templateStatus: output.templateStatus != undefined ? output.templateStatus : undefined,
      buttons: output.buttons != undefined
        ? deserializeIngestkorea_restJson_Button(output.buttons) : undefined
    };
  });
};

export const deserializeIngestkorea_restJson_Comment = (
  outputs: any[]
): Comment[] => {
  return outputs.map(output => {
    return {
      commentId: output.commentId != undefined ? output.commentId : undefined,
      content: output.content != undefined ? output.content : undefined,
      status: output.status != undefined ? output.status : undefined,
      createTime: output.createTime != undefined ? output.createTime : undefined
    };
  });
};

export const deserializeIngestkorea_restJson_Button = (
  outputs: any[]
): Button[] => {
  return outputs.map(output => {
    return {
      order: output.order != undefined ? output.order : undefined,
      type: output.type != undefined ? output.type : undefined,
      name: output.name != undefined ? output.name : undefined,
      linkMobile: output.linkMobile != undefined ? output.linkMobile : undefined,
      linkPc: output.linkPc != undefined ? output.linkPc : undefined,
      schemeIos: output.schemeIos != undefined ? output.schemeIos : undefined,
      schemeAndroid: output.schemeAndroid != undefined ? output.schemeAndroid : undefined
    };
  });
};