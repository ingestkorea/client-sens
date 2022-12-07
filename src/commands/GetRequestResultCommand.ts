import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { SensCommand, GetRequestResultInput, GetRequestResultOutput } from '../models';
import { SensClientResolvedConfig } from '../SensClient';
import {
  serializeIngestkorea_restJson_GetRequestResultCommand,
  deserializeIngestkorea_restJson_GetRequestResultCommand
} from '../protocols/GetRequestResult';

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
    let request = await serializeIngestkorea_restJson_GetRequestResultCommand(input, config);
    return request;
  };
  async deserialize(response: HttpResponse): Promise<GetRequestResultCommandOutput> {
    let output = await deserializeIngestkorea_restJson_GetRequestResultCommand(response);
    return output;
  };
};