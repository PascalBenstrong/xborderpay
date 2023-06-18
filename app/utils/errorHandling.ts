import { Option } from "../types";
import zod from "zod";

export function wrapInTryCatch<Tout, Tin>(
  func: (data: Tin) => Promise<Option<Tout>>
): (data: Tin) => Promise<Option<Tout>> {
  return async (data: Tin) => {
    try {
      return await func(data);
    } catch (error) {
      return Option.fromErrorAndMessage(error, "Something went wrong!");
    }
  };
}

export function wrapInTryCatchVoid<Tout>(
  func: () => Promise<Option<Tout>>
): () => Promise<Option<Tout>> {
  return async () => {
    try {
      return await func();
    } catch (error) {
      return Option.fromErrorAndMessage(error, "Something went wrong!");
    }
  };
}

export function transformValidation<T>(
  schema: zod.ZodType<T>
): (value: T, message?: string) => Option<T> {
  return (value: T, message?: string): Option<T> => {
    const result = schema.safeParse(value);

    if (!result.success) return Option.fromError(message || result.error);

    return Option.fromValue(result.data);
  };
}
