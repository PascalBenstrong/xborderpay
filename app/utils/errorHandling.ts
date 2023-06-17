import { Option } from "../types";

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
