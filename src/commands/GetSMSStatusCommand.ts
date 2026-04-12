import {
  SensClientResolvedConfig,
  SensCommand,
  GetSMSStatusRequest,
  GetSMSStatusResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_GetSMSStatusCommand, de_GetSMSStatusCommand } from "../protocols/GetSMSStatus.js";

export interface GetSMSStatusCommandInput extends GetSMSStatusRequest {}
export interface GetSMSStatusCommandOutput extends MetadataBearer, GetSMSStatusResult {}

const MAX_LIMIT = 100;

export class GetSMSStatusCommand extends SensCommand<
  GetSMSStatusCommandInput,
  GetSMSStatusCommandOutput,
  SensClientResolvedConfig
> {
  input: GetSMSStatusCommandInput;
  serializer: RequestSerializer<GetSMSStatusCommandInput, SensClientResolvedConfig>;
  deserializer: ResponseDeserializer<GetSMSStatusCommandOutput, SensClientResolvedConfig>;
  constructor(input: GetSMSStatusCommandInput) {
    super(input);
    this.input = {
      requestId: input.requestId,
      pageSize: input.pageSize ? Math.min(MAX_LIMIT, Math.max(1, input.pageSize)) : MAX_LIMIT,
      ...(input.nextToken && { nextToken: input.nextToken }),
    };
    this.serializer = se_GetSMSStatusCommand;
    this.deserializer = de_GetSMSStatusCommand;
  }
}
