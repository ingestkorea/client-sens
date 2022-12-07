import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { SensCommand, ListChannelsInput, ListChannelsOutput } from '../models';
import { SensClientResolvedConfig } from '../SensClient';
import {
  serializeIngestkorea_restJson_ListChannelsCommand,
  deserializeIngestkorea_restJson_ListChannelsCommand,
} from '../protocols/ListChannels';
import { IngestkoreaError } from '@ingestkorea/util-error-handler';

export interface ListChannelsCommandInput extends ListChannelsInput { };
export interface ListChannelsCommandOutput extends ListChannelsOutput { };

export class ListChannelsCommand extends SensCommand<
  ListChannelsCommandInput, ListChannelsCommandOutput, SensClientResolvedConfig
> {
  input: ListChannelsCommandInput
  constructor(input: ListChannelsCommandInput) {
    super(input);
    this.input = {
      ...input
    };
  };
  async serialize(input: ListChannelsCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    if (!config.serviceId.kakao) throw new IngestkoreaError({
      code: 400, type: 'Bad Request', message: 'Invalid Params', description: 'Please Check Kakao ServiceId'
    });
    let request = await serializeIngestkorea_restJson_ListChannelsCommand(input, config);
    return request;
  };
  async deserialize(response: HttpResponse): Promise<ListChannelsCommandOutput> {
    let output = await deserializeIngestkorea_restJson_ListChannelsCommand(response);
    return output;
  };
};