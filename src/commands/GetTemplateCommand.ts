import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { SensCommand, GetTemplateInput, GetTemplateOutput } from '../models';
import { SensClientResolvedConfig } from '../SensClient';
import {
  serializeIngestkorea_restJson_GetTemplateCommand,
  deserializeIngestkorea_restJson_GetTemplateCommand
} from '../protocols/GetTemplate';
import { IngestkoreaError } from '@ingestkorea/util-error-handler';

export interface GetTemplateCommandInput extends GetTemplateInput { };
export interface GetTemplateCommandOutput extends GetTemplateOutput { };

export class GetTemplateCommand extends SensCommand<
  GetTemplateCommandInput, GetTemplateCommandOutput, SensClientResolvedConfig
> {
  input: GetTemplateCommandInput
  constructor(input: GetTemplateCommandInput) {
    super(input);
    this.input = {
      ...input
    };
  };
  async serialize(input: GetTemplateCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    if (!config.serviceId.kakao) throw new IngestkoreaError({
      code: 400, type: 'Bad Request', message: 'Invalid Params', description: 'Please Check Kakao ServiceId'
    });
    let request = await serializeIngestkorea_restJson_GetTemplateCommand(input, config);
    return request;
  };
  async deserialize(response: HttpResponse): Promise<GetTemplateCommandOutput> {
    let output = await deserializeIngestkorea_restJson_GetTemplateCommand(response);
    return output;
  };
};