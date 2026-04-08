import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { SensClientResolvedConfig } from "./SensClient.js";

export type Middleware = (next: Handler) => Handler;

export type Handler = (
  input: { request: HttpRequest },
  context: SensClientResolvedConfig
) => Promise<{ response: HttpResponse }>;
