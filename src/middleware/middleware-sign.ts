import { createHmac } from "crypto";
import { buildQueryString } from "@ingestkorea/util-http-handler";
import { Middleware } from "../models/index.js";
import { NCP_ACCESS_KEY, NCP_TIMESTAMP, NCP_SIGNATURE } from "./constants.js";

export const middlewareNcpSign: Middleware = (next) => async (input, context) => {
  const { accessKey, secretKey } = context.credentials;

  const method = input.request.method;
  const queryString = buildQueryString(input.request.query);
  const path = queryString ? `${input.request.path}?${queryString}` : input.request.path;

  const space = " ";
  const newLine = "\n";
  const timestamp = new Date().getTime().toString();

  const stringToSign = [method + space + path, timestamp, accessKey].join(newLine);
  const signature = createHmac("sha256", secretKey).update(stringToSign).digest("base64");

  input.request.headers = {
    ...input.request.headers,
    [NCP_ACCESS_KEY]: accessKey,
    [NCP_TIMESTAMP]: timestamp,
    [NCP_SIGNATURE]: signature,
  };

  return next(input, context);
};
