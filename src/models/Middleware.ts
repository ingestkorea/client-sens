import { HttpRequest, HttpResponse, NodeHttpHandler } from "@ingestkorea/util-http-handler";
import { SensClientResolvedConfig } from "../SensClient";
import { MetadataBearer } from "./MetadataBearer";

export interface BuildMiddleware {
  (request: HttpRequest, config: SensClientResolvedConfig): Promise<HttpRequest>;
}

export interface DeserializeMiddleware {
  (request: HttpRequest, config: SensClientResolvedConfig, handler: NodeHttpHandler): Promise<{
    response: HttpResponse;
    output: MetadataBearer;
  }>;
}
