import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { SensCommand, GetRequestStatusInput, GetRequestStatusOutput } from '../models';
import { SensClientResolvedConfig } from '../SensClient';
import {
  serializeIngestkorea_restJson_GetRequestStatusCommand,
  deserializeIngestkorea_restJson_GetRequestStatusCommand
} from '../protocols/GetRequestStatus';

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
    let request = await serializeIngestkorea_restJson_GetRequestStatusCommand(input, config);
    return request;
  };
  async deserialize(response: HttpResponse): Promise<GetRequestStatusCommandOutput> {
    let output = await deserializeIngestkorea_restJson_GetRequestStatusCommand(response);
    return output;
  };
};
