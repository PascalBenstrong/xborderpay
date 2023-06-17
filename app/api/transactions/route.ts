import { NextResponse } from "next/server";
import { Order, Transaction } from "../../types";
import auth from "../auth";
import { getTransactionsHbar } from "../hedera/account";
import { JwtPayload } from "jsonwebtoken";

export const GET = auth(async (request, tokenPayload) => {
  const { searchParams } = new URL(request.url);

  const { sub } = tokenPayload as JwtPayload;
  const order = searchParams.get("order") as Order | "asc";
  const limit = searchParams.get("limit") as any as number;
  const after = searchParams.get("after");
  const before = searchParams.get("before");

  const data = await getTransactionsHbar({
    accountId: sub!,
    order,
    limit,
    after,
    before,
  });

  if (data.isSuccess) return NextResponse.json(data.value);

  return new Response(data.getErrorOrMessage(), { status: 500 });
});
