export const trimText = (input: string): string => input.trim();

export const prettyPhoneNum = (input: string): string => input.replace(/\-/gi, "");

/** @returns content-length(euc-kr) */
export const getContentLength = (input: string): number => {
  return input.split("").reduce((acc, text) => {
    let byte = Buffer.from(text).length;
    let modulo = byte % 3;
    modulo ? (acc += 1) : (acc += 2);
    return acc;
  }, 0);
};
