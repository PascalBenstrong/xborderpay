import { verify, TokenPayload } from "./accounts/jwt";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/api/accounts/auth";
import { wrapInTryCatchVoid, wrapInTryCatch } from "@/utils/errorHandling";
import { Option } from "@/types";
import { NextResponse } from "next/server";
import { JwtPayload } from "jsonwebtoken";

const auth = wrapInTryCatch<TokenPayload, Request>(async (request) => {
  let bearer: any = request.headers.get("authorization");

  if (!bearer) return Option.fromError(new Error("Unauthorized!"));

  bearer = bearer.split(" ");
  if (bearer.length !== 2) return Option.fromError(new Error("Unauthorized!"));

  bearer = bearer[1];

  const payload = verify(bearer as string);

  if (!payload.isSuccess) return Option.fromError(new Error("Unauthorized!"));

  return payload;
});
export default function (
  func: (request: Request, tokenPayload: TokenPayload) => Promise<Response>
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    const authresult = await auth(request);

    if (!authresult.isSuccess)
      return new Response("Unauthorized!", { status: 401 });
    return await func(request, authresult.value!);
  };
}
