import { HttpHandlerError } from "@ingestkorea/util-http-handler";
import { Middleware, SensError } from "../models/index.js";
import { INGESTKOREA_REQUEST_LOG, INGESTKOREA_RETRY, INGESTKOREA_RETRY_DELAY } from "./constants.js";

const RETRYABLE_ERROR_TYPE: SensError["type"][] = [
  "SDK.TIMEOUT",
  "SDK.NETWORK_ERROR",
  "Too Many Requests",
  "Internal Server Error",
];

export const middlewareRetry: Middleware = (next) => async (input, context) => {
  const MAX_RETRIES = 3;
  const MIN_DELAY_MS = 300;
  const BASE_DELAY_MS = 500;
  const MAX_DELAY_MS = 5_000;

  let attempts = 0;
  let totalRetryDelay = 0;

  input.request.headers = input.request.headers ?? {};

  while (attempts < MAX_RETRIES) {
    attempts++;

    const requestLog = `attempt=${attempts}; max=${MAX_RETRIES}; totalRetryDelay=${totalRetryDelay}`;
    input.request.headers[INGESTKOREA_REQUEST_LOG] = requestLog;

    try {
      const { response } = await next(input, context);

      response.headers[INGESTKOREA_RETRY] = attempts.toString();
      response.headers[INGESTKOREA_RETRY_DELAY] = totalRetryDelay.toString();

      return { response };
    } catch (error) {
      let currentError: SensError;
      if (error instanceof SensError) {
        currentError = error;
      } else if (error instanceof HttpHandlerError) {
        currentError = new SensError({
          code: -1,
          type: error.code,
          message: error.message,
        });
      } else {
        currentError = new SensError({
          code: -1,
          type: "SDK.UNKNOWN_ERROR",
          message: error instanceof Error ? error.message : String(error),
        });
      }

      const isRetryable = RETRYABLE_ERROR_TYPE.some((type) => currentError.type.startsWith(type));
      if (!isRetryable) {
        throw currentError;
      }

      if (attempts >= MAX_RETRIES) {
        currentError.errors.push(requestLog);
        throw currentError;
      }

      const exp = BASE_DELAY_MS * 2 ** (attempts - 1);
      const capped = Math.min(MAX_DELAY_MS, exp);
      const baseWait = Math.max(MIN_DELAY_MS, Math.floor(capped / 2));
      const jitter = Math.floor(Math.random() * (capped - baseWait));
      const delay = baseWait + jitter;

      totalRetryDelay += delay;

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new SensError({
    code: -1,
    type: "SDK.UNKNOWN_ERROR",
    message: "Unexpected retry loop termination",
  });
};
