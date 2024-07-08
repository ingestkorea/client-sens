import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { SensCommand, GetAlimtalkTemplateInput, GetAlimtalkTemplateOutput } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import {
  serializeIngestkorea_restJson_GetAlimtalkTemplateCommand,
  deserializeIngestkorea_restJson_GetAlimtalkTemplateCommand,
} from "../protocols/GetAlimtalkTemplate";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";

export interface GetAlimtalkTemplateCommandInput extends GetAlimtalkTemplateInput {}
export interface GetAlimtalkTemplateCommandOutput extends GetAlimtalkTemplateOutput {}

export class GetAlimtalkTemplateCommand extends SensCommand<
  GetAlimtalkTemplateCommandInput,
  GetAlimtalkTemplateCommandOutput,
  SensClientResolvedConfig
> {
  input: GetAlimtalkTemplateCommandInput;
  constructor(input: GetAlimtalkTemplateCommandInput) {
    super(input);
    this.input = {
      ...input,
    };
  }
  async serialize(
    input: GetAlimtalkTemplateCommandInput,
    config: SensClientResolvedConfig
  ): Promise<HttpRequest> {
    if (!config.serviceId.kakao)
      throw new IngestkoreaError({
        code: 400,
        type: "Bad Request",
        message: "Invalid Params",
        description: "Please Check Kakao ServiceId",
      });
    let request = await serializeIngestkorea_restJson_GetAlimtalkTemplateCommand(input, config);
    return request;
  }
  async deserialize(response: HttpResponse): Promise<GetAlimtalkTemplateCommandOutput> {
    let output = await deserializeIngestkorea_restJson_GetAlimtalkTemplateCommand(response);
    return output;
  }
}
