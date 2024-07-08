import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { SensCommand, GetSMSResultInput, GetSMSResultOutput } from "../models";
import { SensClientResolvedConfig } from "../SensClient";
import {
  serializeIngestkorea_restJson_GetSMSResultCommand,
  deserializeIngestkorea_restJson_GetSMSResultCommand,
} from "../protocols/GetSMSResult";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";

export interface GetSMSResultCommandInput extends GetSMSResultInput {}
export interface GetSMSResultCommandOutput extends GetSMSResultOutput {}

export class GetSMSResultCommand extends SensCommand<
  GetSMSResultCommandInput,
  GetSMSResultCommandOutput,
  SensClientResolvedConfig
> {
  input: GetSMSResultCommandInput;
  constructor(input: GetSMSResultCommandInput) {
    super(input);
    this.input = {
      ...input,
    };
  }
  async serialize(
    input: GetSMSResultCommandInput,
    config: SensClientResolvedConfig
  ): Promise<HttpRequest> {
    if (!config.serviceId.sms)
      throw new IngestkoreaError({
        code: 400,
        type: "Bad Request",
        message: "Invalid Params",
        description: "Please Check SMS ServiceId",
      });
    let request = await serializeIngestkorea_restJson_GetSMSResultCommand(input, config);
    return request;
  }
  async deserialize(response: HttpResponse): Promise<GetSMSResultCommandOutput> {
    let output = await deserializeIngestkorea_restJson_GetSMSResultCommand(response);
    return output;
  }
}
