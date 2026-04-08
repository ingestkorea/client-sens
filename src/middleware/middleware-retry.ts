import { IngestkoreaError } from "@ingestkorea/util-error-handler";
import { Middleware } from "../models/index.js";
import { INGESTKOREA_REQUEST_LOG, INGESTKOREA_RETRY, INGESTKOREA_RETRY_DELAY } from "./constants.js";

export const middlewareRetry: Middleware = (next) => async (input, context) => {
  const MAX_RETRIES = 3;
  const BASE_DELAY_MS = 500;
  const MAX_DELAY_MS = 5_000;

  let attempts = 0;
  let totalRetryDelay = 0;

  input.request.headers ??= {};

  let lastError = new IngestkoreaError({
    code: 400,
    type: "Bad Request",
    message: "Invalid Request",
    description: { attempts, maxRetries: MAX_RETRIES, totalRetryDelay },
  });

  while (attempts < MAX_RETRIES) {
    const attemptNo = attempts + 1;

    const requestLog = `attempt=${attemptNo}; max=${MAX_RETRIES}; totalRetryDelay=${totalRetryDelay}`;
    input.request.headers[INGESTKOREA_REQUEST_LOG] = requestLog;

    try {
      const { response } = await next(input, context);

      response.headers[INGESTKOREA_RETRY] = attemptNo.toString();
      response.headers[INGESTKOREA_RETRY_DELAY] = totalRetryDelay.toString();

      return { response };
    } catch (error) {
      attempts++;

      lastError.error.description = { attempts, maxRetries: MAX_RETRIES, totalRetryDelay };

      if (error instanceof IngestkoreaError) {
        lastError.error.description = {
          ...lastError.error.description,
          detail: error.error.description,
        };
      } else {
        lastError.error.description = {
          ...lastError.error.description,
          detail: String((error as any)?.message ?? error),
        };
      }

      if (attempts >= MAX_RETRIES) {
        lastError.error.description = { attempts, maxRetries: MAX_RETRIES, totalRetryDelay };
        throw lastError;
      }

      const exp = BASE_DELAY_MS * 2 ** (attempts - 1);
      const capped = Math.min(MAX_DELAY_MS, exp);
      const delay = Math.floor(Math.random() * capped);

      totalRetryDelay += delay;

      lastError.error.description = { attempts, maxRetries: MAX_RETRIES, totalRetryDelay };

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};
