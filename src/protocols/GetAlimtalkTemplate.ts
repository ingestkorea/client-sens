import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import {
  GetAlimtalkTemplateOutput,
  TemplateDetail,
  Comment,
  Attachment,
  TemplateButtons,
  MetadataBearer,
} from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import {
  GetAlimtalkTemplateCommandInput,
  GetAlimtalkTemplateCommandOutput,
} from "../commands/GetAlimtalkTemplateCommand";
import { parseBody, parseErrorBody, deserializeMetadata } from "./constants";

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

export const deserializeIngestkorea_restJson_GetAlimtalkTemplateCommand = async (response: {
  response: HttpResponse;
  output: MetadataBearer;
}): Promise<GetAlimtalkTemplateCommandOutput> => {
  const { response: httpResponse, output } = response;
  if (httpResponse.statusCode > 300) await parseErrorBody(httpResponse);

  const data: any = await parseBody(httpResponse); // GetAlimtalkTemplateOutput
  let contents: any = {};
  contents = await deserializeIngestkorea_restJson_GetAlimtalkTemplateOutput(data);

  return {
    $metadata: {
      ...deserializeMetadata(httpResponse),
      ...output.$metadata,
    },
    ...contents,
  };
};

export const deserializeIngestkorea_restJson_GetAlimtalkTemplateOutput = async (
  output: any[]
): Promise<GetAlimtalkTemplateOutput> => {
  return {
    templates: deserializeIngestkorea_restJson_AlimtalkTemplateDetail(output),
  };
};

export const deserializeIngestkorea_restJson_AlimtalkTemplateDetail = (outputs: any[]): TemplateDetail[] => {
  let result = outputs.map((output) => {
    return {
      createTime: output.createTime != undefined ? output.createTime : undefined,
      updateTime: output.updateTime != undefined ? output.updateTime : undefined,
      channelId: output.channelId != undefined ? output.channelId : undefined,
      templateCode: output.templateCode != undefined ? output.templateCode : undefined,
      templateName: output.templateName != undefined ? output.templateName : undefined,
      categoryCode: output.categoryCode != undefined ? output.categoryCode : undefined,
      categoryName: output.categoryName != undefined ? output.categoryName : undefined,
      messageType: output.messageType != undefined ? output.messageType : undefined,
      emphasizeType: output.emphasizeType != undefined ? output.emphasizeType : undefined,
      content: output.content != undefined ? output.content : undefined,
      adContent: output.adContent != undefined ? output.adContent : undefined,
      extraContent: output.extraContent != undefined ? output.extraContent : undefined,
      title: output.title != undefined ? output.title : undefined,
      additionalTitle: output.additionalTitle != undefined ? output.additionalTitle : undefined,
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
      securityFlag: output.securityFlag != null ? output.securityFlag : undefined,
      isBlock: output.isBlock != null ? output.isBlock : undefined,
      isDormant: output.isDormant != null ? output.isDormant : undefined,
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
      attachment:
        output.attachment != undefined
          ? deserializeIngestkorea_restJson_AlimtalkTemplateCommentAttachment(output.attachment)
          : undefined,
    };
  });
  return result;
};

export const deserializeIngestkorea_restJson_AlimtalkTemplateCommentAttachment = (outputs: any[]): Attachment[] => {
  let result: Attachment[] = outputs.map((output) => {
    return {
      fileName: output.fileName != undefined ? output.fileName : undefined,
      fileUrl: output.fileUrl != undefined ? output.fileUrl : undefined,
    };
  });
  return result;
};

export const deserializeIngestkorea_restJson_AlimtalkTemplateButton = (outputs: any[]): TemplateButtons[] => {
  let result: TemplateButtons[] = outputs.map((output) => {
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
