import {
  SensClientResolvedConfig,
  SensCommand,
  GetAlimtalkStatusRequest,
  GetAlimtalkStatusResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_GetAlimtalkStatusCommand, de_GetAlimtalkStatusCommand } from "../protocols/GetAlimtalkStatus.js";

export interface GetAlimtalkStatusCommandInput extends GetAlimtalkStatusRequest {}
export interface GetAlimtalkStatusCommandOutput extends MetadataBearer, GetAlimtalkStatusResult {}

const MAX_LIMIT = 100;

export class GetAlimtalkStatusCommand extends SensCommand<
  GetAlimtalkStatusCommandInput,
  GetAlimtalkStatusCommandOutput,
  SensClientResolvedConfig
> {
  input: GetAlimtalkStatusCommandInput;
  serializer: RequestSerializer<GetAlimtalkStatusCommandInput, SensClientResolvedConfig>;
  deserializer: ResponseDeserializer<GetAlimtalkStatusCommandOutput, SensClientResolvedConfig>;
  constructor(input: GetAlimtalkStatusCommandInput) {
    super(input);
    this.input = {
      requestId: input.requestId,
      pageSize: input.pageSize ? Math.min(MAX_LIMIT, Math.max(1, input.pageSize)) : MAX_LIMIT,
      ...(input.nextToken && { nextToken: input.nextToken }),
    };
    this.serializer = se_GetAlimtalkStatusCommand;
    this.deserializer = de_GetAlimtalkStatusCommand;
  }
}
