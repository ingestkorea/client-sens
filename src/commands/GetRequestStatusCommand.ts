import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { SensCommand, GetRequestStatusInput, GetRequestStatusOutput } from '../models';
import { SensClientResolvedConfig } from '../SensClient';
import {
  serializeIngestkorea_restJson_GetRequestStatusCommand,
  deserializeIngestkorea_restJson_GetRequestStatusCommand
} from '../protocols/GetRequestStatus';
import { IngestkoreaError } from '@ingestkorea/util-error-handler';

export interface GetRequestStatusCommandInput extends GetRequestStatusInput { };
export interface GetRequestStatusCommandOutput extends GetRequestStatusOutput { };

export class GetRequestStatusCommand extends SensCommand<
  GetRequestStatusCommandInput, GetRequestStatusCommandOutput, SensClientResolvedConfig
> {
  input: GetRequestStatusCommandInput
  constructor(input: GetRequestStatusCommandInput) {
    super(input);
    this.input = {
      ...input
    };
  };
  async serialize(input: GetRequestStatusCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    if (!config.serviceId.kakao) throw new IngestkoreaError({
      code: 400, type: 'Bad Request', message: 'Invalid Params', description: 'Please Check Kakao ServiceId'
    });
    let request = await serializeIngestkorea_restJson_GetRequestStatusCommand(input, config);
    return request;
  };
  async deserialize(response: HttpResponse): Promise<GetRequestStatusCommandOutput> {
    let output = await deserializeIngestkorea_restJson_GetRequestStatusCommand(response);
    return output;
  };
};
