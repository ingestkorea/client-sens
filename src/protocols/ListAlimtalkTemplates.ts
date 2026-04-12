import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  SensClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  ListAlimtalkTemplatesResult,
  Template,
} from "../models/index.js";
import {
  ListAlimtalkTemplatesCommandInput,
  ListAlimtalkTemplatesCommandOutput,
} from "../commands/ListAlimtalkTemplatesCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact, convertToUtc } from "./constants.js";

export const se_ListAlimtalkTemplatesCommand: RequestSerializer<
  ListAlimtalkTemplatesCommandInput,
  SensClientResolvedConfig
> = async (input, config) => {
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

export const de_ListAlimtalkTemplatesCommand: ResponseDeserializer<
  ListAlimtalkTemplatesCommandOutput,
  SensClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_ListAlimtalkTemplatesResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_ListAlimtalkTemplatesResult = (output: any[]): ListAlimtalkTemplatesResult => {
  return {
    templates: Array.isArray(output) ? de_TemplateList(output) : [],
  };
};

const de_TemplateList = (output: any[]): Template[] => {
  return (output || [])
    .filter((e) => e != null)
    .map((entry) => de_Template(entry))
    .sort((a, b) => {
      // 생성 날짜 기준 내림차순
      const dateA = (a.createTime ?? "").replace(/\.\d{3}Z?$/, "");
      const dateB = (b.createTime ?? "").replace(/\.\d{3}Z?$/, "");

      if (dateB < dateA) return -1;
      if (dateB > dateA) return 1;
      return 0;
    });
};

export const de_Template = (output: any): Template => {
  return {
    createTime: output.createTime ? convertToUtc(output.createTime) : undefined,
    updateTime: output.updateTime ? convertToUtc(output.updateTime) : undefined,
    channelId: output.channelId != undefined ? output.channelId : undefined,
    templateCode: output.templateCode != undefined ? output.templateCode : undefined,
    templateName: output.templateName != undefined ? output.templateName : undefined,
  };
};
