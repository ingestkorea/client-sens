import { HttpRequest } from "@ingestkorea/util-http-handler";
import { SensClientResolvedConfig } from "../SensClient";
import { BuildMiddleware } from "../models";

const REQUEST_HEADER = "x-ingestkorea-request";

export const middlewareIngestkoreaMetadata: BuildMiddleware = async (
  request: HttpRequest,
  config: SensClientResolvedConfig
) => {
  request.headers["x-ingestkorea-user-agent"] = "@ingestkorea/client-sens/1.6.x";
  request.headers[REQUEST_HEADER] = "attempt=1";
  return request;
};
