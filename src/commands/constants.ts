export const SMS_MAX = 90;
export const LMS_MAX = 2000;
export const MMS_FILE_MAX = 300; // KiByte

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

export const getRequestDuration = (input?: number): { startTime: string; endTime: string } => {
  const OFFSET = 9 * 60 * 60 * 1000;

  const hours = input ? Math.abs(input) : 24;
  const hours_ms = hours * 60 * 60 * 1000;

  const current_ms = new Date().getTime() + OFFSET;
  const startTime_ms = current_ms - hours_ms;

  let current_kst = new Date(current_ms).toISOString().replace(/\.\d{3}Z$/, "");
  let startTime_kst = new Date(startTime_ms).toISOString().replace(/\.\d{3}Z$/, "");

  return { startTime: startTime_kst, endTime: current_kst };
};
