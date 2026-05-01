export const SENS_ERROR_CODE_SPEC = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  429: "Too Many Requests",
  500: "Internal Server Error",
} as const;

export const NCLOUD_ERROR_CODE_SPEC = {
  "100": { status: 400, type: SENS_ERROR_CODE_SPEC["400"] },
  "200": { status: 401, type: SENS_ERROR_CODE_SPEC["401"] },
  "210": { status: 403, type: SENS_ERROR_CODE_SPEC["403"] },
  "300": { status: 404, type: SENS_ERROR_CODE_SPEC["404"] },
  "400": { status: 429, type: SENS_ERROR_CODE_SPEC["429"] },
  "410": { status: 429, type: SENS_ERROR_CODE_SPEC["429"] },
  "420": { status: 429, type: SENS_ERROR_CODE_SPEC["429"] },
  "900": { status: 500, type: SENS_ERROR_CODE_SPEC["500"] },
} as const;

export type SesnResponseErrorType = (typeof SENS_ERROR_CODE_SPEC)[keyof typeof SENS_ERROR_CODE_SPEC];

export interface SensErrorResponse {
  status: number;
  errorMessage?: string;
  errors?: object;
}

export interface NCloudErrorResponse {
  error: {
    errorCode: string;
    message?: string;
    details?: string;
  };
}

export const SENS_ERROR_BODY_SPEC: [[keyof SensErrorResponse][number], string, boolean][] = [
  ["status", "number", true],
  ["errorMessage", "string", false],
  ["errors", "object", false],
];

export const NCLOUD_ERROR_BODY_SPEC: [[keyof NCloudErrorResponse["error"]][number], string, boolean][] = [
  ["errorCode", "string", true],
  ["message", "string", false],
  ["details", "string", false],
];
