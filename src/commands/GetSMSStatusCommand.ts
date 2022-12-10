import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { SensCommand, GetSMSStatusInput, GetSMSStatusOutput } from '../models';
import { SensClientResolvedConfig } from '../SensClient';
import {
  serializeIngestkorea_restJson_GetSMSStatusCommand,
  deserializeIngestkorea_restJson_GetSMSStatusCommand
} from '../protocols/GetSMSStatus';
import { IngestkoreaError } from '@ingestkorea/util-error-handler';

export interface GetSMSStatusCommandInput extends GetSMSStatusInput { };
export interface GetSMSStatusCommandOutput extends GetSMSStatusOutput { };

export class GetSMSStatusCommand extends SensCommand<
  GetSMSStatusCommandInput, GetSMSStatusCommandOutput, SensClientResolvedConfig
> {
  input: GetSMSStatusCommandInput
  constructor(input: GetSMSStatusCommandInput) {
    super(input);
    this.input = {
      ...input
    };
  };
  async serialize(input: GetSMSStatusCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    if (!config.serviceId.sms) throw new IngestkoreaError({
      code: 400, type: 'Bad Request', message: 'Invalid Params', description: 'Please Check SMS ServiceId'
    });
    let request = await serializeIngestkorea_restJson_GetSMSStatusCommand(input, config);
    return request;
  };
  async deserialize(response: HttpResponse): Promise<GetSMSStatusCommandOutput> {
    let output = await deserializeIngestkorea_restJson_GetSMSStatusCommand(response);
    return output;
  };
}