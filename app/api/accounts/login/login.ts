import db from "../accounts.db";
import { Option } from "@/types";
import { validateEmail } from "../validation";
import { verifyHash } from "../password";
import { signJwt } from "../jwt";

declare type RegisterResponse = {
  jwt: string;
};

export const login = async (
  email: string,
  password: string
): Promise<Option<RegisterResponse>> => {
  const emailValidationResult = validateEmail(email);

  if (!emailValidationResult.isSuccess)
    return Option.fromError(emailValidationResult.error);

  const found = await db.findOne({ email: email });

  if (!found)
    return Option.fromError(new Error("No account with those credentials!"));

  const passwordValidationResult = await verifyHash(password, found.password);

  if (!passwordValidationResult.isSuccess)
    return Option.fromError(passwordValidationResult.error);

  const token = signJwt({ subject: found._id.toString() });

  return Option.fromValue({ jwt: token.jwt, exp: token.exp });
};
