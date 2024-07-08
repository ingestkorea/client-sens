import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";

export abstract class SensCommand<ClientInput, ClientOutput, ClientResolvedConfig> {
  input: ClientInput;
  constructor(input: ClientInput) {
    this.input = input;
  }
  abstract serialize(input: ClientInput, config: ClientResolvedConfig): Promise<HttpRequest>;
  abstract deserialize(response: HttpResponse): Promise<ClientOutput>;
}
