import crypto from "node:crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Option } from "@/types";

export const sha512 = crypto.createHash("sha512");

const expiresInSeconds = 60 * 60;

declare type SignJwtResult = { jwt: string; /* hash: string; */ exp: number };

declare type Payload = string | Object | Buffer | JwtPayload;

export const signJwt = (payload: Payload): SignJwtResult => {
  const options: jwt.SignOptions = {
    expiresIn: expiresInSeconds,
    issuer: process.env.JWT_ISSUER!,
    audience: process.env.JWT_AUDIENCE,
    notBefore: Math.ceil(Date.now() / 1000),
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, options);
  //const tokenHash = sha512.update(token).digest("hex");

  const decoded = jwt.decode(token) as JwtPayload;

  return { jwt: token, /* hash: tokenHash, */ exp: decoded.exp! };
};

export const verify = (token: string): Option<Payload> => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as Payload;
    return Option.fromValue(payload);
  } catch (error) {
    return Option.fromErrorAndMessage(error, "Something went wrong!");
  }
};
