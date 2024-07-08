import { IngestkoreaError, ingestkoreaErrorCodeChecker } from "@ingestkorea/util-error-handler";
import { HttpResponse, collectBodyString, destroyStream } from "@ingestkorea/util-http-handler";

export const parseBody = async (output: HttpResponse): Promise<any> => {
  const { statusCode, headers, body: streamBody } = output;

  const isValid = await verifyJsonHeader(headers["content-type"]);

  if (!isValid) {
    await destroyStream(streamBody);
    let customError = new IngestkoreaError({
      code: 400,
      type: "Bad Request",
      message: "Invalid Request",
      description: "content-type is not application/json",
    });
    if (ingestkoreaErrorCodeChecker(statusCode)) customError.error.code = statusCode;
    throw customError;
  }

  const data = await collectBodyString(streamBody);
  if (data.length) return JSON.parse(data);
  return {};
};

export const parseErrorBody = async (output: HttpResponse): Promise<void> => {
  const { statusCode, headers, body: streamBody } = output;
  const isValid = await verifyJsonHeader(headers["content-type"]);

  await destroyStream(streamBody);

  let customError = new IngestkoreaError({
    code: 400,
    type: "Bad Request",
    message: "Invalid Request",
    description: "content-type is not application/json",
  });
  if (ingestkoreaErrorCodeChecker(statusCode)) customError.error.code = statusCode;
  if (!isValid) throw customError;

  const data = await collectBodyString(streamBody);
  if (data.length) customError.error.description = JSON.parse(data);
  throw customError;
};

const verifyJsonHeader = async (contentType: string): Promise<boolean> => {
  return /application\/json/gi.exec(contentType) ? true : false;
};
