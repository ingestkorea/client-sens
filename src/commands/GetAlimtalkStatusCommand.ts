import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { SensCommand, GetAlimtalkStatusInput, GetAlimtalkStatusOutput, MetadataBearer } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import {
  serializeIngestkorea_restJson_GetAlimtalkStatusCommand,
  deserializeIngestkorea_restJson_GetAlimtalkStatusCommand,
} from "../protocols/GetAlimtalkStatus";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";

export interface GetAlimtalkStatusCommandInput extends GetAlimtalkStatusInput {}
export interface GetAlimtalkStatusCommandOutput extends GetAlimtalkStatusOutput, MetadataBearer {}

export class GetAlimtalkStatusCommand extends SensCommand<
  GetAlimtalkStatusCommandInput,
  GetAlimtalkStatusCommandOutput,
  SensClientResolvedConfig
> {
  input: GetAlimtalkStatusCommandInput;
  constructor(input: GetAlimtalkStatusCommandInput) {
    super(input);
    this.input = {
      ...input,
    };
  }
  async serialize(input: GetAlimtalkStatusCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    if (!config.serviceId.kakao)
      throw new IngestkoreaError({
        code: 400,
        type: "Bad Request",
        message: "Invalid Params",
        description: "Please Check Kakao ServiceId",
      });
    let request = await serializeIngestkorea_restJson_GetAlimtalkStatusCommand(input, config);
    return request;
  }
  async deserialize(response: {
    response: HttpResponse;
    output: MetadataBearer;
  }): Promise<GetAlimtalkStatusCommandOutput> {
    let output = await deserializeIngestkorea_restJson_GetAlimtalkStatusCommand(response);
    return output;
  }
}
