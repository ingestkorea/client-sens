import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  SensClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  ListSMSStatusResult,
} from "../models/index.js";
import { ListSMSStatusCommandInput, ListSMSStatusCommandOutput } from "../commands/ListSMSStatusCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";
import { de_GetSMSStatusResult } from "./GetSMSStatus.js";

export const se_ListSMSStatusCommand: RequestSerializer<ListSMSStatusCommandInput, SensClientResolvedConfig> = async (
  input,
  config
) => {
  const hostname = "sens.apigw.ntruss.com";
  const path = "/sms/v2/services/" + config.serviceId.sms + "/messages";
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
    hostname,
    path,
    query,
    headers,
  });
};

export const de_ListSMSStatusCommand: ResponseDeserializer<
  ListSMSStatusCommandOutput,
  SensClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_ListSMSStatusResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_ListSMSStatusResult = (output: any): ListSMSStatusResult => {
  return de_GetSMSStatusResult(output);
};
