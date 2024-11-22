import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { MetadataBearer } from "./MetadataBearer";

export abstract class SensCommand<ClientInput, ClientOutput, ClientResolvedConfig> {
  input: ClientInput;
  constructor(input: ClientInput) {
    this.input = input;
  }
  abstract serialize(input: ClientInput, config: ClientResolvedConfig): Promise<HttpRequest>;
  abstract deserialize(output: { response: HttpResponse; output: MetadataBearer }): Promise<ClientOutput>;
}
