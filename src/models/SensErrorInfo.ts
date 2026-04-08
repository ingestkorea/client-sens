export interface SensErrorResponse {
  status: number;
  errorMessage?: string;
  errors?: object;
}

export interface SensErrorInput {
  code: number;
  type: string;
  message: string;
  invalidInputs?: InvalidInputs[];
}

export type InvalidInputs = { type: string; message: string };

export class SensError extends Error {
  public readonly code: number;
  public readonly type: string;
  public readonly invalidInputs: InvalidInputs[];
  constructor(info: SensErrorInput) {
    super(info.message);
    this.name = "SensError";
    this.code = info.code;
    this.type = info.type;
    this.invalidInputs = info.invalidInputs || [];
  }
}
