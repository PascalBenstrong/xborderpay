import db from "../accounts.db";
import { User, Option, Currency } from "@/types";
import { ObjectId } from "mongodb";
import { userValidation } from "../validation";
import { createHash } from "../password";
import { signJwt } from "../jwt";
import { WalletCreateRequest, createWallet } from "../../wallets/createWallet";
import { createAccount } from "../../hedera/account";

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

  const token = signJwt({ sub: id.toString() });

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

  const walletCreateRequest: WalletCreateRequest = {
    userId: id.toString(),
    currency: Currency.USD,
    name: Currency.USD,
  };

  await createWallet(walletCreateRequest);

  return Option.fromValue({ jwt: token.jwt, exp: token.exp });
};
