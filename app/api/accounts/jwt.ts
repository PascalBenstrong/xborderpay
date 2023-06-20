import crypto from "node:crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Option } from "@/types";

export const sha512 = crypto.createHash("sha512");

const expiresInSeconds = 60 * 60 * 12;

declare type SignJwtResult = { jwt: string; /* hash: string; */ exp: number };

export declare type TokenPayload = string | Object | Buffer | JwtPayload;

export const signJwt = (payload: TokenPayload): SignJwtResult => {
  const options: jwt.SignOptions = {
    expiresIn: expiresInSeconds,
    issuer: process.env.JWT_ISSUER!,
    audience: process.env.JWT_AUDIENCE,
    notBefore: "1ms",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, options);
  //const tokenHash = sha512.update(token).digest("hex");

  const decoded = jwt.decode(token) as JwtPayload;

  return { jwt: token, /* hash: tokenHash, */ exp: decoded.exp! };
};

export const verify = (token: string): Option<TokenPayload> => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    return Option.fromValue(payload);
  } catch (error) {
    return Option.fromErrorAndMessage(error, "Something went wrong!");
  }
};
