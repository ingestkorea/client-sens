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
import { createValidator } from "../utils/validator.js";

const ALLOWED_CONTENT_TYPES = ["application/json"];

const validateSensErrorResponse = createValidator<SensErrorResponse>([
  { key: "status", expectedType: "number" },
  { key: "errorMessage", expectedType: "string", optional: true },
  { key: "errors", expectedType: "object", optional: true },
]);

const validateNCloudErrorResponseDetail = createValidator<NCloudErrorResponse["error"]>([
  { key: "errorCode", expectedType: "string" },
  { key: "message", expectedType: "string", optional: true },
  { key: "details", expectedType: "string", optional: true },
]);

const validateNCloudErrorResponse = createValidator<NCloudErrorResponse>([
  { key: "error", expectedType: "object", innerValidator: validateNCloudErrorResponseDetail },
]);

const createContentTypeValidator = (allowedTypes: string[]) => {
  return async (output: HttpResponse): Promise<void> => {
    const contentType = output.headers["content-type"]?.toLowerCase();

    if (!contentType) {
      throw new SensError({
        code: -1,
        type: "SDK.REQUEST_ERROR",
        message: `Invalid content-type. Expected ${allowedTypes.join(", ")}`,
      });
    }

    const match = allowedTypes.find((type) => contentType.includes(type));

    if (match) {
      return;
    }

    await destroyStream(output.body);
    throw new SensError({
      code: -1,
      type: "SDK.REQUEST_ERROR",
      message: `Invalid content-type. Expected ${allowedTypes.join(", ")}, got ${contentType}`,
    });
  };
};

const validateContentType = createContentTypeValidator(ALLOWED_CONTENT_TYPES);

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
  await validateContentType(output);

  try {
    const data = await collectBodyString(output.body);
    return data.length ? JSON.parse(data) : {};
  } catch (e) {
    await destroyStream(output.body);
    throw new SensError({
      code: -1,
      type: "SDK.REQUEST_ERROR",
      message: "parse response body error",
    });
  }
};

export const parseErrorBody = async (output: HttpResponse): Promise<never> => {
  await validateContentType(output);

  const { statusCode, body: streamBody } = output;

  try {
    const data = await collectBodyString(streamBody);

    const sensError = validateSensErrorResponse(data);
    if (sensError.success) {
      throw handleSensError(sensError.data, statusCode);
    }

    const ncloudError = validateNCloudErrorResponse(data);
    if (ncloudError.success) {
      throw handleNCloudError(ncloudError.data, statusCode);
    }

    const summary = data ? data.slice(0, 100).trim() : "empty response";
    throw new SensError({
      code: statusCode,
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
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, compact(value)]),
    ) as any;
  }

  return obj;
};

export const convertToUtc = (input: string) => {
  const utcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
  return utcRegex.test(input) ? input : new Date(input.replace(" ", "T") + "+09:00").toISOString();
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
