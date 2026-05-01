import { Middleware } from "../models/index.js";
import { INGESTKOREA_USER_AGENT } from "./constants.js";

export const middlewareIngestkoreaMetadata: Middleware = (next) => async (input, context) => {
  input.request.headers = {
    ...input.request.headers,
    [INGESTKOREA_USER_AGENT]: "@ingestkorea/client-sens/1.10.x",
  };

  return next(input, context);
};
