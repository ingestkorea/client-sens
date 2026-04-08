import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  SensClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  GetAlimtalkTemplateResult,
  TemplateDetail,
  Comment,
  Attachment,
  TemplateButtonExtend,
} from "../models/index.js";
import {
  GetAlimtalkTemplateCommandInput,
  GetAlimtalkTemplateCommandOutput,
} from "../commands/GetAlimtalkTemplateCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";
import { de_Template } from "./ListAlimtalkTemplates.js";

export const se_GetAlimtalkTemplateCommand: RequestSerializer<
  GetAlimtalkTemplateCommandInput,
  SensClientResolvedConfig
> = async (input, config) => {
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
    hostname,
    path,
    query,
    headers,
  });
};

export const de_GetAlimtalkTemplateCommand: ResponseDeserializer<
  GetAlimtalkTemplateCommandOutput,
  SensClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_GetAlimtalkTemplateResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_GetAlimtalkTemplateResult = (output: any[]): GetAlimtalkTemplateResult => {
  return {
    templates: Array.isArray(output) ? de_TemplateDetailList(output) : [],
  };
};

const de_TemplateDetailList = (output: any[]): TemplateDetail[] => {
  return (output || []).filter((e) => e != null).map((entry) => de_TemplateDetail(entry));
};

const de_TemplateDetail = (output: any): TemplateDetail => {
  return {
    ...de_Template(output),
    categoryCode: output.categoryCode != undefined ? output.categoryCode : undefined,
    categoryName: output.categoryName != undefined ? output.categoryName : undefined,
    messageType: output.messageType != undefined ? output.messageType : undefined,
    emphasizeType: output.emphasizeType != undefined ? output.emphasizeType : undefined,
    content: output.content != undefined ? output.content : undefined,
    adContent: output.adContent != undefined ? output.adContent : undefined,
    extraContent: output.extraContent != undefined ? output.extraContent : undefined,
    title: output.title != undefined ? output.title : undefined,
    additionalTitle: output.additionalTitle != undefined ? output.additionalTitle : undefined,
    comments: output.comments != undefined ? de_CommentList(output.comments) : [],
    templateInspectionStatus:
      output.templateInspectionStatus != undefined ? output.templateInspectionStatus : undefined,
    templateStatus: output.templateStatus != undefined ? output.templateStatus : undefined,
    buttons: output.buttons != undefined ? de_TemplateButtonExtendList(output.buttons) : [],
    securityFlag: output.securityFlag !== undefined ? output.securityFlag : undefined,
    isBlock: output.isBlock !== undefined ? output.isBlock : undefined,
    isDormant: output.isDormant !== undefined ? output.isDormant : undefined,
  };
};

const de_CommentList = (output: any[]): Comment[] => {
  return (output || []).filter((e) => e != null).map((entry) => de_Comment(entry));
};

const de_Comment = (output: any): Comment => {
  return {
    commentId: output.commentId != undefined ? output.commentId : undefined,
    content: output.content != undefined ? output.content : undefined,
    status: output.status != undefined ? output.status : undefined,
    createTime: output.createTime != undefined ? output.createTime : undefined,
    attachment: output.attachment != undefined ? de_AttachmentList(output.attachment) : [],
  };
};

const de_AttachmentList = (output: any[]): Attachment[] => {
  return (output || []).filter((e) => e != null).map((entry) => de_Attachment(entry));
};

const de_Attachment = (output: any): Attachment => {
  return {
    fileName: output.fileName != undefined ? output.fileName : undefined,
    fileUrl: output.fileUrl != undefined ? output.fileUrl : undefined,
  };
};

const de_TemplateButtonExtendList = (output: any[]): TemplateButtonExtend[] => {
  return (output || []).filter((e) => e != null).map((entry) => de_TemplateButtonExtend(entry));
};

const de_TemplateButtonExtend = (output: any): TemplateButtonExtend => {
  return {
    order: output.order !== undefined ? output.order : undefined,
    type: output.type != undefined ? output.type : undefined,
    name: output.name != undefined ? output.name : undefined,
    linkMobile: output.linkMobile != undefined ? output.linkMobile : undefined,
    linkPc: output.linkPc != undefined ? output.linkPc : undefined,
    schemeIos: output.schemeIos != undefined ? output.schemeIos : undefined,
    schemeAndroid: output.schemeAndroid != undefined ? output.schemeAndroid : undefined,
  };
};
