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
    };
    this.serializer = se_GetSMSStatusCommand;
    this.deserializer = de_GetSMSStatusCommand;
  }
}
