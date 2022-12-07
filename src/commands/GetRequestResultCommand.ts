import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { SensCommand, GetRequestResultInput, GetRequestResultOutput } from '../models';
import { SensClientResolvedConfig } from '../SensClient';
import {
  serializeIngestkorea_restJson_GetRequestResultCommand,
  deserializeIngestkorea_restJson_GetRequestResultCommand
} from '../protocols/GetRequestResult';
import { IngestkoreaError } from '@ingestkorea/util-error-handler';

export interface GetRequestResultCommandInput extends GetRequestResultInput { };
export interface GetRequestResultCommandOutput extends GetRequestResultOutput { };

export class GetRequestResultCommand extends SensCommand<
  GetRequestResultCommandInput, GetRequestResultCommandOutput, SensClientResolvedConfig
> {
  input: GetRequestResultCommandInput
  constructor(input: GetRequestResultCommandInput) {
    super(input);
    this.input = {
      ...input
    };
  };
  async serialize(input: GetRequestResultCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    if (!config.serviceId.kakao) throw new IngestkoreaError({
      code: 400, type: 'Bad Request', message: 'Invalid Params', description: 'Please Check Kakao ServiceId'
    });
    let request = await serializeIngestkorea_restJson_GetRequestResultCommand(input, config);
    return request;
  };
  async deserialize(response: HttpResponse): Promise<GetRequestResultCommandOutput> {
    let output = await deserializeIngestkorea_restJson_GetRequestResultCommand(response);
    return output;
  };
};