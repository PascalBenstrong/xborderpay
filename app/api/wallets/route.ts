import { NextResponse } from "next/server";
import auth from "../auth";
import { getWallets } from "./getWallets";
import { JwtPayload } from "jsonwebtoken";

export const GET = auth(async (request, tokenPayload) => {
  const { sub } = tokenPayload as JwtPayload;
  const data = await getWallets({ userId: sub! });

  if (data.isSuccess) return NextResponse.json(data.value);

  return new Response(data.getErrorOrMessage(), { status: 500 });
});
