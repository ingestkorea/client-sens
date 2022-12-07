import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { SensCommand, SendAlimtalkInput, SendAlimtalkOutput } from '../models';
import { SensClientResolvedConfig } from '../SensClient';
import {
  serializeIngestkorea_restJson_SendAlimtalkCommand,
  deserializeIngestkorea_restJson_SendAlimtalkCommand
} from '../protocols/SendAlimtalk';

export interface SendAlimtalkCommandInput extends SendAlimtalkInput { };
export interface SendAlimtalkCommandOutput extends SendAlimtalkOutput { };

export class SendAlimtalkCommand extends SensCommand<
  SendAlimtalkCommandInput, SendAlimtalkCommandOutput, SensClientResolvedConfig
>{
  input: SendAlimtalkCommandInput
  constructor(input: SendAlimtalkCommandInput) {
    super(input);
    this.input = {
      ...input
    };
  };
  async serialize(input: SendAlimtalkCommandInput, config: SensClientResolvedConfig): Promise<HttpRequest> {
    let request = await serializeIngestkorea_restJson_SendAlimtalkCommand(input, config);
    return request;
  };
  async deserialize(response: HttpResponse): Promise<SendAlimtalkCommandOutput> {
    let output = await deserializeIngestkorea_restJson_SendAlimtalkCommand(response);
    return output;
  };
};
