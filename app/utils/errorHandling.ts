import {Option} from "../types"


export function wrapInTryCatch<T, Tin>(
    func: (data: Tin) => Promise<Option<T>>
  ): (data: Tin) => Promise<Option<T>> {
    return async (data: Tin) => {
      try {
        return await func(data);
      } catch (error) {
        return Option.fromErrorAndMessage(error, "Something went wrong!");
      }
    };
  }
  
  export function wrapInTryCatchVoid<T>(
    func: () => Promise<Option<T>>
  ): () => Promise<Option<T>> {
    return async () => {
      try {
        return await func();
      } catch (error) {
        return Option.fromErrorAndMessage(error, "Something went wrong!");
      }
    };
  }