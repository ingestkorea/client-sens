import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { SensCommand, ListAlimtalkTemplatesInput, ListAlimtalkTemplatesOutput } from '../models'
import { SensClientResolvedConfig } from '../SensClient';
import {
  serializeIngestkorea_restJson_ListAlimtalkTemplatesCommand,
  deserializeIngestkorea_restJson_ListAlimtalkTemplatesCommand
} from '../protocols/ListAlimtalkTemplates';
import { IngestkoreaError } from '@ingestkorea/util-error-handler';

export interface ListAlimtalkTemplatesCommandInput extends ListAlimtalkTemplatesInput { };
export interface ListAlimtalkTemplatesCommandOutput extends ListAlimtalkTemplatesOutput { };

export class ListAlimtalkTemplatesCommand extends SensCommand<
  ListAlimtalkTemplatesCommandInput, ListAlimtalkTemplatesCommandOutput, SensClientResolvedConfig
> {
  input: ListAlimtalkTemplatesCommandInput
  constructor(input: ListAlimtalkTemplatesCommandInput) {
    super(input);
    this.input = {
      ...input
    };
  };
  async serialize(
    input: ListAlimtalkTemplatesCommandInput, config: SensClientResolvedConfig
  ): Promise<HttpRequest> {
    if (!config.serviceId.kakao) throw new IngestkoreaError({
      code: 400, type: 'Bad Request', message: 'Invalid Params', description: 'Please Check Kakao ServiceId'
    });
    let request = await serializeIngestkorea_restJson_ListAlimtalkTemplatesCommand(input, config);
    return request;
  };
  async deserialize(response: HttpResponse): Promise<ListAlimtalkTemplatesCommandOutput> {
    let output = await deserializeIngestkorea_restJson_ListAlimtalkTemplatesCommand(response);
    return output;
  };
};