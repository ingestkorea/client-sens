import { HttpRequest } from '@ingestkorea/util-http-handler';
import { SensClientResolvedConfig } from '../SensClient';

export const middlewareIngestkoreaMetadata = async (
  request: HttpRequest, config: SensClientResolvedConfig
): Promise<HttpRequest> => {
  const { longDate } = await convertFormatDate(request.headers['x-ncp-apigw-timestamp']);

  request.headers = {
    ...request.headers,
    ['x-ingestkorea-date']: longDate,
    ['x-ingestkorea-user-agent']: '@ingestkorea/client-sens/1.5.x'
  };
  return request;
};

/**
 * @param input milliseconds
 */
const convertFormatDate = async (input?: string | number) => {
  let milliseconds = input ? Number(input) : new Date().getTime();
  let iso8601 = new Date(milliseconds).toISOString().replace(/\.\d{3}Z$/, "Z");

  let longDate = iso8601.replace(/[\-:]/g, "");
  let shortDate = longDate.slice(0, 8);
  return { longDate, shortDate };
};
