import { HttpResponse, collectBodyString, destroyStream } from "@ingestkorea/util-http-handler";
import { ResponseMetadata, SensErrorResponse, SensError } from "../models/index.js";
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
      code: statusCode ?? 400,
      type: "Bad Request",
      message: "response content-type is not application/json",
    });
  }

  const data = await collectBodyString(streamBody);

  if (data.length) {
    try {
      return JSON.parse(data);
    } catch (e) {
      await destroyStream(streamBody);

      throw new SensError({
        code: statusCode ?? 400,
        type: "Bad Request",
        message: "parse response body error",
      });
    }
  }

  return {};
};

export const parseErrorBody = async (output: HttpResponse): Promise<void> => {
  const { statusCode, headers, body: streamBody } = output;

  const error = new SensError({
    code: statusCode ?? 400,
    type: "Bad Request",
    message: "something wrong",
  });

  if (!isJsonResponse(headers["content-type"])) {
    await destroyStream(streamBody);
    error.message = "response content-type is not application/json";
    throw error;
  }

  const data = await collectBodyString(streamBody);
  await destroyStream(streamBody);

  const sensErrorBody = isSensErrorBody(data);
  if (!sensErrorBody) {
    throw error;
  }

  throw new SensError({
    code: sensErrorBody.status,
    type: SENS_ERROR_CODE_SPEC[sensErrorBody.status] || "Unknown Error",
    message: sensErrorBody.errorMessage || "Something wrong",
    ...(sensErrorBody.errors &&
      Array.isArray(sensErrorBody.errors) && {
        invalidInputs: sensErrorBody.errors.map((msg) => {
          return { type: "not-valid.args", message: msg };
        }),
      }),
  });
};

const SENS_ERROR_CODE_SPEC: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  429: "Too Many Requests",
  500: "Internal Server Error",
};

const SENS_ERROR_BODY_SPEC: [[keyof SensErrorResponse][number], string, boolean][] = [
  ["status", "number", true],
  ["errorMessage", "string", false],
  ["errors", "object", false],
];

const isSensErrorBody = (input: unknown): SensErrorResponse | null => {
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
  return /application\/json/gi.exec(contentType || "") ? true : false;
};
