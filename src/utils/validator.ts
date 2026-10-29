type AllowedTypes = "string" | "number" | "boolean" | "object";

type BaseSpec<T> = {
  key: keyof T & string;
  expectedType: AllowedTypes;
  optional?: boolean;
  innerValidator?: (input: string) => { success: boolean; data?: any; error?: string };
};

export const createValidator = <T extends Record<string, any>, P = T>(baseSpec: BaseSpec<T>[]) => {
  return (input: unknown): { success: true; data: P } | { success: false; error: string } => {
    if (typeof input !== "string") {
      return { success: false, error: "Input must be a string." };
    }

    try {
      const obj = JSON.parse(input);

      if (obj === null || typeof obj !== "object") {
        return { success: false, error: "Parsed JSON is not an object." };
      }

      for (const spec of baseSpec) {
        const { key, expectedType, optional, innerValidator } = spec;

        if (!(key in obj)) {
          if (optional) continue;
          return { success: false, error: `Missing required field: '${key}'` };
        }

        if (obj[key] === null) {
          if (optional) continue;
          return { success: false, error: `Required field '${key}' cannot be null.` };
        }

        if (typeof obj[key] !== expectedType) {
          return {
            success: false,
            error: `Invalid type for '${key}'. Expected ${expectedType}, got ${typeof obj[key]}`,
          };
        }

        if (expectedType === "object" && innerValidator) {
          const innerResult = innerValidator(JSON.stringify(obj[key]));
          if (!innerResult.success) {
            return {
              success: false,
              error: `${key}.${innerResult.error}`,
            };
          }
        }
      }

      return { success: true, data: obj as P };
    } catch {
      return { success: false, error: "Invalid JSON format." };
    }
  };
};
