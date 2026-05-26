import { HttpResponse, collectBodyString, destroyStream } from "@ingestkorea/util-http-handler";
import {
  ResponseMetadata,
  SensError,
  SensErrorResponse,
  NCloudErrorResponse,
  SENS_ERROR_CODE_SPEC,
  NCLOUD_ERROR_CODE_SPEC,
} from "../models/index.js";
import { INGESTKOREA_RETRY, INGESTKOREA_RETRY_DELAY, NCP_TRACE_ID } from "../middleware/constants.js";

const ALLOWED_CONTENT_TYPES = ["application/json"];

const SENS_ERROR_BODY_SPEC: [[keyof SensErrorResponse][number], string, boolean][] = [
  ["status", "number", true],
  ["errorMessage", "string", false],
  ["errors", "object", false],
];

const NCLOUD_ERROR_BODY_SPEC: [[keyof NCloudErrorResponse["error"]][number], string, boolean][] = [
  ["errorCode", "string", true],
  ["message", "string", false],
  ["details", "string", false],
];

export const deserializeMetadata = (response: HttpResponse): ResponseMetadata => {
  const attempts = response.headers[INGESTKOREA_RETRY] || "1";
  const totalRetryDelay = response.headers[INGESTKOREA_RETRY_DELAY] || "0";
  const traceId = response.headers[NCP_TRACE_ID] || undefined;

  return {
    httpStatusCode: response.statusCode,
    attempts: Number(attempts),
    totalRetryDelay: Number(totalRetryDelay),
    ...(traceId && { traceId }),
  };
};

export const parseBody = async (output: HttpResponse): Promise<any> => {
  const { statusCode, headers, body: streamBody } = output;

  if (!isSupportContentType(ALLOWED_CONTENT_TYPES, headers["content-type"])) {
    await destroyStream(streamBody);
    throw new SensError({
      code: statusCode,
      type: "SDK.REQUEST_ERROR",
      message: `response content-type is not ${ALLOWED_CONTENT_TYPES.join(" or ")}`,
    });
  }

  try {
    const data = await collectBodyString(streamBody);
    return data.length ? JSON.parse(data) : {};
  } catch (e) {
    throw new SensError({
      code: -1,
      type: "SDK.REQUEST_ERROR",
      message: "parse response body error",
    });
  }
};

export const parseErrorBody = async (output: HttpResponse): Promise<never> => {
  const { statusCode, headers, body: streamBody } = output;

  if (!isSupportContentType(ALLOWED_CONTENT_TYPES, headers["content-type"])) {
    await destroyStream(streamBody);
    throw new SensError({
      code: -1,
      type: "SDK.REQUEST_ERROR",
      message: `response content-type is not ${ALLOWED_CONTENT_TYPES.join(" or ")}`,
    });
  }

  try {
    const data = await collectBodyString(streamBody);

    const sensContent = isSensErrorResponse(data);
    const nCloudContent = isNCloudErrorResponse(data);

    if (sensContent) {
      throw handleSensError(sensContent, statusCode);
    }

    if (nCloudContent) {
      throw handleNCloudError(nCloudContent, statusCode);
    }

    const summary = data ? data.slice(0, 100).trim() : "empty response";
    throw new SensError({
      code: -1,
      type: "SDK.UNKNOWN_ERROR",
      message: "Invalid Naver Cloud Platform response format",
      errors: [`HTTP ${statusCode} - ${summary}...`],
    });
  } catch (e) {
    await destroyStream(streamBody);
    throw e;
  }
};

export const compact = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => compact(item)) as any;
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => value !== undefined) // undefined 필드 제거
        .map(([key, value]) => [key, compact(value)]) // 내부 값 재귀 처리
    ) as any;
  }

  return obj;
};

export const convertToUtc = (input: string) => {
  const utcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
  return utcRegex.test(input) ? input : new Date(input.replace(" ", "T") + "+09:00").toISOString();
};

const isSupportContentType = (allowedTypes: string[], contentType?: string): boolean => {
  const matchedType = allowedTypes.find((type) => contentType?.toLowerCase().includes(type));
  return !!matchedType;
};

const isSensErrorResponse = (input: unknown): SensErrorResponse | null => {
  if (typeof input !== "string") return null;

  try {
    const data = JSON.parse(input);
    if (!data || typeof data !== "object") return null;

    const isValid = SENS_ERROR_BODY_SPEC.every(([key, type, required]) => {
      const value = data[key];
      if (required && (value === undefined || value === null)) return false;
      if (value !== undefined && typeof value !== type) return false;
      return true;
    });

    return isValid ? (data as SensErrorResponse) : null;
  } catch {
    return null;
  }
};

const isNCloudErrorResponse = (input: unknown): NCloudErrorResponse | null => {
  if (typeof input !== "string") return null;

  try {
    const data = JSON.parse(input);
    if (!(data && typeof data == "object" && typeof data.error == "object")) return null;

    const isValid = NCLOUD_ERROR_BODY_SPEC.every(([key, type, required]) => {
      const value = data.error[key];
      if (required && (value === undefined || value === null)) return false;
      if (value !== undefined && typeof value !== type) return false;
      return true;
    });

    return isValid ? (data as NCloudErrorResponse) : null;
  } catch {
    return null;
  }
};

const isSensErrorCode = (code: number): code is keyof typeof SENS_ERROR_CODE_SPEC => {
  return code in SENS_ERROR_CODE_SPEC;
};

const isNCloudErrorCode = (code: string): code is keyof typeof NCLOUD_ERROR_CODE_SPEC => {
  return code in NCLOUD_ERROR_CODE_SPEC;
};

const handleSensError = (data: SensErrorResponse, httpStatusCode: number): SensError => {
  return new SensError({
    code: httpStatusCode,
    type: isSensErrorCode(data.status) ? SENS_ERROR_CODE_SPEC[data.status] : "SDK.UNKNOWN_ERROR",
    message: data.errorMessage || "something wrong",
    ...(Array.isArray(data?.errors) && {
      errors: data.errors.filter((d) => !!d).map((d) => String(d)),
    }),
  });
};

const handleNCloudError = (data: NCloudErrorResponse, httpStatusCode: number): SensError => {
  const { errorCode, message, details } = data.error;

  throw new SensError({
    code: httpStatusCode,
    type: isNCloudErrorCode(errorCode) ? NCLOUD_ERROR_CODE_SPEC[errorCode].type : "SDK.UNKNOWN_ERROR",
    message: message || "something wrong",
    ...(typeof details == "string" && { errors: [details] }),
  });
};
