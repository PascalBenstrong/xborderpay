import db from "./accounts.db";
import { User, Option } from "@/types";
import { ObjectId } from "mongodb";
import { userValidation } from "./validation";
import { createHash } from "./password";
import { signJwt } from "./jwt";

declare type RegisterResponse = {
  jwt: string;
};

export const register = async (
  user: User,
  password: string
): Promise<Option<RegisterResponse>> => {
  const userValidationResult = userValidation(user);

  if (!userValidationResult.isSuccess)
    return Option.fromError(userValidationResult.error);

  const passwordValidationResult = await createHash(password);

  if (!passwordValidationResult.isSuccess)
    return Option.fromError(passwordValidationResult.error);

  const found = await db.findOne({ email: user.email });

  if (found) return Option.fromError(new Error("user already exists!"));

  const id = new ObjectId();

  const token = signJwt({ subject: id.toString() });

  const userInsertResult = await db.insertOne({
    ...user,
    _id: id,
    password: passwordValidationResult.value,
  });

  if (!userInsertResult.acknowledged) {
    return Option.fromError(
      new Error("Failed to create user! Try again later.")
    );
  }

  return Option.fromValue({ jwt: token.jwt, exp: token.exp });
};
