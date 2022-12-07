import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { SensCommand, ListTemplatesInput, ListTemplatesOutput } from '../models'
import { SensClientResolvedConfig } from '../SensClient';
import {
  serializeIngestkorea_restJson_ListTemplatesCommand,
  deserializeIngestkorea_restJson_ListTemplatesCommand
} from '../protocols/ListTemplates';
import { IngestkoreaError } from '@ingestkorea/util-error-handler';

export interface ListTemplatesCommandInput extends ListTemplatesInput { };
export interface ListTemplatesCommandOutput extends ListTemplatesOutput { };

export class ListTemplatesCommand extends SensCommand<
  ListTemplatesCommandInput, ListTemplatesCommandOutput, SensClientResolvedConfig
> {
  input: ListTemplatesCommandInput
  constructor(input: ListTemplatesCommandInput) {
    super(input);
    this.input = {
      ...input
    };
  };
  async serialize(input: ListTemplatesCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    if (!config.serviceId.kakao) throw new IngestkoreaError({
      code: 400, type: 'Bad Request', message: 'Invalid Params', description: 'Please Check Kakao ServiceId'
    });
    let request = await serializeIngestkorea_restJson_ListTemplatesCommand(input, config);
    return request;
  };
  async deserialize(response: HttpResponse): Promise<ListTemplatesCommandOutput> {
    let output = await deserializeIngestkorea_restJson_ListTemplatesCommand(response);
    return output;
  };
};