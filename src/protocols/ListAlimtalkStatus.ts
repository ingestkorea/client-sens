import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  SensClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  ListAlimtalkStatusResult,
} from "../models/index.js";
import {
  ListAlimtalkStatusCommandInput,
  ListAlimtalkStatusCommandOutput,
} from "../commands/ListAlimtalkStatusCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";
import { de_GetAlimtalkStatusResult } from "./GetAlimtalkStatus.js";

export const se_ListAlimtalkStatusCommand: RequestSerializer<
  ListAlimtalkStatusCommandInput,
  SensClientResolvedConfig
> = async (input, config) => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/alimtalk/v2/services/" + config.serviceId.kakao + "/messages";
  const headers = {
    host: hostname,
  };
  const query = Object.entries(input).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = String(value);
    }
    return acc;
  }, {} as Record<string, string>);

  return new HttpRequest({
    protocol: "https:",
    method: "GET",
    hostname: hostname,
    path: path,
    headers: headers,
    query,
  });
};

export const de_ListAlimtalkStatusCommand: ResponseDeserializer<
  ListAlimtalkStatusCommandOutput,
  SensClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_ListAlimtalkStatusResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_ListAlimtalkStatusResult = (output: any): ListAlimtalkStatusResult => {
  return de_GetAlimtalkStatusResult(output);
};
