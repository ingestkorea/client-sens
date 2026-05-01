import { SensError } from "../models/index.js";

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

export const convertToUtc = (input: string) => {
  const utcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
  return utcRegex.test(input) ? input : new Date(input.replace(" ", "T") + "+09:00").toISOString();
};

export const convertToKst = (input: number) => {
  const KST_OFFSET = 9 * 3_600_000;
  return new Date(input + KST_OFFSET).toISOString().replace(/\.\d{3}Z$/, "");
};

// UTC
export const getDefaultRequestDuration = (config: {
  durationLimitMs: number;
}): { startTime: string; endTime: string } => {
  const now = Date.now();
  return {
    startTime: new Date(now - config.durationLimitMs).toISOString(),
    endTime: new Date(now).toISOString(),
  };
};

// UTC
export const resolveRequestDuration = (
  input: { startTime: string; endTime: string },
  config: { durationLimitMs: number }
): { startTimeMs: number; endTimeMs: number } => {
  const start = new Date(input.startTime).getTime();
  const end = new Date(input.endTime).getTime();

  const diff = end - start;

  if (diff < 0) {
    throw new SensError({
      code: -1,
      type: "SDK.GENERAL_ERROR",
      message: "조회 가능 날짜 오류. 종료일이 시작일보다 빠를 수 없습니다.",
      errors: [`종료일: ${input.endTime}`, `시작일: ${input.startTime}`],
    });
  }

  if (diff > config.durationLimitMs) {
    throw new SensError({
      code: -1,
      type: "SDK.GENERAL_ERROR",
      message: `최대 ${config.durationLimitMs / (24 * 3_600_000)}일 이내에서 조회 가능합니다.`,
    });
  }

  return {
    startTimeMs: start,
    endTimeMs: end,
  };
};
