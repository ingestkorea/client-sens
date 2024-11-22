import { HttpRequest } from "@ingestkorea/util-http-handler";
import { SensClientResolvedConfig } from "../SensClient";
import { BuildMiddleware } from "../models";

export const middlewareSortHeaders: BuildMiddleware = async (
  request: HttpRequest,
  config: SensClientResolvedConfig
) => {
  let { headers } = request;
  let init: Record<string, string> = {};
  const resolvedHeaders = Object.keys(headers)
    .sort()
    .reduce((acc, curr) => {
      acc[curr] = headers[curr];
      return acc;
    }, init);
  request.headers = resolvedHeaders;
  return request;
};
