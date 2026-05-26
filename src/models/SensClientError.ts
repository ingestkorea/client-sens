import { HttpHandlerErrorCode } from "@ingestkorea/util-http-handler";
import { SesnResponseErrorType } from "./SensApiError.js";

type SensClientErrorType = "SDK.AUTH_ERROR" | "SDK.GENERAL_ERROR" | "SDK.REQUEST_ERROR" | "SDK.UNKNOWN_ERROR";

export type SensErrorType = SesnResponseErrorType | SensClientErrorType | HttpHandlerErrorCode;

export interface SensErrorInput {
  code: number;
  type: SensErrorType;
  message: string;
  errors?: string[];
}

export class SensError extends Error {
  public readonly code: number;
  public readonly type: SensErrorType;
  public readonly errors: string[];
  public readonly timestamp: string;
  constructor(info: SensErrorInput) {
    super(info.message);
    this.name = "SensError";
    this.code = info.code;
    this.type = info.type;
    this.errors = info.errors || [];
    this.timestamp = new Date().toISOString();
  }
}
