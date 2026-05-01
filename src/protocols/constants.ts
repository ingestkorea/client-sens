import { HttpResponse, collectBodyString, destroyStream } from "@ingestkorea/util-http-handler";
import {
  ResponseMetadata,
  SensError,
  SensErrorResponse,
  NCloudErrorResponse,
  SENS_ERROR_CODE_SPEC,
  SENS_ERROR_BODY_SPEC,
  NCLOUD_ERROR_CODE_SPEC,
  NCLOUD_ERROR_BODY_SPEC,
} from "../models/index.js";
import { INGESTKOREA_RETRY, INGESTKOREA_RETRY_DELAY } from "../middleware/constants.js";

export const deserializeMetadata = (response: HttpResponse): ResponseMetadata => {
  const attempts = response.headers[INGESTKOREA_RETRY] || "1";
  const totalRetryDelay = response.headers[INGESTKOREA_RETRY_DELAY] || "0";

  return {
    httpStatusCode: response.statusCode,
    attempts: Number(attempts),
    totalRetryDelay: Number(totalRetryDelay),
  };
};

export const parseBody = async (output: HttpResponse): Promise<any> => {
  const { statusCode, headers, body: streamBody } = output;

  if (!isJsonResponse(headers["content-type"])) {
    await destroyStream(streamBody);

    throw new SensError({
      code: -1,
      type: "SDK.REQUEST_ERROR",
      message: "response content-type is not application/json",
    });
  }

  try {
    const data = await collectBodyString(streamBody);
    return data.length ? JSON.parse(data) : {};
  } catch (e) {
    throw new SensError({
      code: -1,
      type: "SDK.REQUEST_ERROR",
      message: e instanceof Error ? e.message : "parse response body error",
    });
  }
};

export const parseErrorBody = async (output: HttpResponse): Promise<never> => {
  const { statusCode, headers, body: streamBody } = output;

  if (!isJsonResponse(headers["content-type"])) {
    await destroyStream(streamBody);
    throw new SensError({
      code: -1,
      type: "SDK.REQUEST_ERROR",
      message: "response content-type is not application/json",
    });
  }

  const data = await collectBodyString(streamBody);
  const sensErrorBody = isSensErrorResponse(data);
  const nCloudErrorBody = isNCloudErrorResponse(data);

  if (sensErrorBody) {
    const errorType: SensError["type"] = isSensErrorCode(sensErrorBody.status)
      ? SENS_ERROR_CODE_SPEC[sensErrorBody.status]
      : "SDK.UNKNOWN_ERROR";

    throw new SensError({
      code: isSensErrorCode(sensErrorBody.status) ? sensErrorBody.status : statusCode,
      type: errorType,
      message: sensErrorBody.errorMessage || errorType,
      ...(sensErrorBody.errors &&
        Array.isArray(sensErrorBody.errors) && {
          errors: sensErrorBody.errors.filter((d) => !!d),
        }),
    });
  }

  if (nCloudErrorBody) {
    const { errorCode } = nCloudErrorBody.error;
    const errorType: SensError["type"] = isNCloudErrorCode(errorCode)
      ? NCLOUD_ERROR_CODE_SPEC[errorCode].type
      : "SDK.UNKNOWN_ERROR";

    throw new SensError({
      code: isNCloudErrorCode(errorCode) ? NCLOUD_ERROR_CODE_SPEC[errorCode].status : statusCode,
      type: errorType,
      message: nCloudErrorBody.error.details || "Something wrong",
    });
  }

  throw new SensError({
    code: -1,
    type: "SDK.UNKNOWN_ERROR",
    message: "Invalid Naver Cloud Platform response format",
    errors: [`${statusCode} - ${data.slice(0, 120)}...`],
  });
};

const isSensErrorCode = (code: number): code is keyof typeof SENS_ERROR_CODE_SPEC => {
  return code in SENS_ERROR_CODE_SPEC;
};

const isNCloudErrorCode = (code: string): code is keyof typeof NCLOUD_ERROR_CODE_SPEC => {
  return code in NCLOUD_ERROR_CODE_SPEC;
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

const isJsonResponse = (contentType?: string): boolean => {
  return contentType?.toLowerCase().includes("application/json") ?? false;
};
