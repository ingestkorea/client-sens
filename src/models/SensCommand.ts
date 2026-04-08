import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";

export type RequestSerializer<InputType, Config> = (input: InputType, config: Config) => Promise<HttpRequest>;
export type ResponseDeserializer<OutputType, Config> = (response: HttpResponse, config: Config) => Promise<OutputType>;

export abstract class SensCommand<ClientInput, ClientOutput, ClientResolvedConfig> {
  input: ClientInput;
  constructor(input: ClientInput) {
    this.input = input;
  }
  abstract serializer: RequestSerializer<ClientInput, ClientResolvedConfig>;
  abstract deserializer: ResponseDeserializer<ClientOutput, ClientResolvedConfig>;
}
