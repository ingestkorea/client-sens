import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { ListAlimtalkTemplatesOutput, Template, Comment, Button, MetadataBearer } from "../models";
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
  output: any
): Promise<ListAlimtalkTemplatesOutput> => {
  return {
    templates: deserializeIngestkorea_restJson_AlimtalkTemplate(output),
  };
};

export const deserializeIngestkorea_restJson_AlimtalkTemplate = (outputs: any[]): Template[] => {
  let result = outputs.map((output) => {
    return {
      createTime: output.createTime != undefined ? output.createTime : undefined,
      updateTime: output.updateTime != undefined ? output.updateTime : undefined,
      channelId: output.channelId != undefined ? output.channelId : undefined,
      templateCode: output.templateCode != undefined ? output.templateCode : undefined,
      templateName: output.templateName != undefined ? output.templateName : undefined,
      content: output.content != undefined ? output.content : undefined,
      comments:
        output.comments != undefined
          ? deserializeIngestkorea_restJson_AlimtalkTemplateComment(output.comments)
          : undefined,
      templateInspectionStatus:
        output.templateInspectionStatus != undefined ? output.templateInspectionStatus : undefined,
      templateStatus: output.templateStatus != undefined ? output.templateStatus : undefined,
      buttons:
        output.buttons != undefined
          ? deserializeIngestkorea_restJson_AlimtalkTemplateButton(output.buttons)
          : undefined,
    };
  });
  return result;
};

export const deserializeIngestkorea_restJson_AlimtalkTemplateComment = (outputs: any[]): Comment[] => {
  let result = outputs.map((output) => {
    return {
      commentId: output.commentId != undefined ? output.commentId : undefined,
      content: output.content != undefined ? output.content : undefined,
      status: output.status != undefined ? output.status : undefined,
      createTime: output.createTime != undefined ? output.createTime : undefined,
    };
  });
  return result;
};

export const deserializeIngestkorea_restJson_AlimtalkTemplateButton = (outputs: any[]): Button[] => {
  let result = outputs.map((output) => {
    return {
      order: output.order != undefined ? output.order : undefined,
      type: output.type != undefined ? output.type : undefined,
      name: output.name != undefined ? output.name : undefined,
      linkMobile: output.linkMobile != undefined ? output.linkMobile : undefined,
      linkPc: output.linkPc != undefined ? output.linkPc : undefined,
      schemeIos: output.schemeIos != undefined ? output.schemeIos : undefined,
      schemeAndroid: output.schemeAndroid != undefined ? output.schemeAndroid : undefined,
    };
  });
  return result;
};
