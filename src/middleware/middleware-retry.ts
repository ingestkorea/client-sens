import { NodeHttpHandler, HttpRequest } from "@ingestkorea/util-http-handler";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";
import { SensClientResolvedConfig } from "../SensClient";
import { DeserializeMiddleware } from "../models";

const REQUEST_HEADER = "x-ingestkorea-request";

export const middlewareRetry: DeserializeMiddleware = async (
  request: HttpRequest,
  config: SensClientResolvedConfig,
  handler: NodeHttpHandler
) => {
  const maxAttempts = 3;
  let attempts = 0;
  let totalRetryDelay = 0;
  let lastError = new IngestkoreaError({
    code: 400,
    type: "Bad Request",
    message: "Invalid Request",
    description: { attempts, maxAttempts, totalRetryDelay },
  });
  while (true) {
    try {
      request.headers[REQUEST_HEADER] = `attempt=${
        attempts + 1
      }; max=${maxAttempts}; totalRetryDelay=${totalRetryDelay}`;
      let { response } = await handler.handle(request);
      return {
        output: {
          $metadata: {
            attempts: attempts + 1,
            totalRetryDelay: totalRetryDelay,
          },
        },
        response,
      };
    } catch (err) {
      attempts++;
      if (attempts == maxAttempts) {
        lastError.error.description.attempts = attempts;
        throw lastError;
      }

      const delay = attempts * 1000;
      totalRetryDelay += delay;
      lastError.error.description = { attempts, maxAttempts, totalRetryDelay };

      if (err instanceof IngestkoreaError) {
        lastError.error.description = {
          ...lastError.error.description,
          detail: err.error.description,
        };
      }
      if (err instanceof Error) {
        lastError.error.description = {
          ...lastError.error.description,
          detail: err.message,
        };
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};
