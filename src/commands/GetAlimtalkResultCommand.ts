import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { SensCommand, GetAlimtalkResultInput, GetAlimtalkResultOutput, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import {
  serializeIngestkorea_restJson_GetAlimtalkResultCommand,
  deserializeIngestkorea_restJson_GetAlimtalkResultCommand,
} from "../protocols/GetAlimtalkResult";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";

export interface GetAlimtalkResultCommandInput extends GetAlimtalkResultInput {}
export interface GetAlimtalkResultCommandOutput extends GetAlimtalkResultOutput, MetadataBearer {}

export class GetAlimtalkResultCommand extends SensCommand<
  GetAlimtalkResultCommandInput,
  GetAlimtalkResultCommandOutput,
  SensClientResolvedConfig
> {
  input: GetAlimtalkResultCommandInput;
  constructor(input: GetAlimtalkResultCommandInput) {
    super(input);
    this.input = {
      ...input,
    };
  }
  async serialize(input: GetAlimtalkResultCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    if (!config.serviceId.kakao)
      throw new IngestkoreaError({
        code: 400,
        type: "Bad Request",
        message: "Invalid Params",
        description: "Please Check Kakao ServiceId",
      });
    let request = await serializeIngestkorea_restJson_GetAlimtalkResultCommand(input, config);
    return request;
  }
  async deserialize(response: {
    response: HttpResponse;
    output: MetadataBearer;
  }): Promise<GetAlimtalkResultCommandOutput> {
    let output = await deserializeIngestkorea_restJson_GetAlimtalkResultCommand(response);
    return output;
  }
}
