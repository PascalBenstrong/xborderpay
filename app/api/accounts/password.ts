import bcrypt from "bcrypt";
import { validatePassword } from "./validation";
import { Option } from "@/types";

const saltRounds = 10;

export const createHash = async (password: string): Promise<Option<string>> => {
  const passwordValidationResult = validatePassword(password);

  if (!passwordValidationResult.isSuccess)
    return Option.fromError(passwordValidationResult.error);

  try {
    return Option.fromValue(await bcrypt.hash(password, saltRounds));
  } catch (error) {
    return Option.fromErrorAndMessage(error, "Something went wrong!");
  }
};

export const verifyHash = async (
  password: string,
  hash: string
): Promise<Option<boolean>> => {
  try {
    const matched = await bcrypt.compare(password, hash);

    if (matched) return Option.fromValue(true);

    return Option.fromError(new Error("Invalid credentials!"));
  } catch (error) {
    return Option.fromErrorAndMessage(error, "Something went wrong!");
  }
};
