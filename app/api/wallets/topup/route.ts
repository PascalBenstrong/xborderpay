import { JwtPayload } from "jsonwebtoken";
import auth from "../../auth";
import transferCurrency from "../../e-transfer/transferCurrency";
import { TransactionType } from "@/types";
import { operatorAccountId, operatorPrivateKey } from "../../hedera/client";

export const POST = auth(async (request, tokenPayload) => {
  try {
    const { sub } = tokenPayload as JwtPayload;

    const data = await request.json();

    const topUpRequest = {
      ...data,
      toUserId: sub!,
      type: TransactionType.Deposit,
      fromAccountId: operatorAccountId,
      fromPrivateKey: operatorPrivateKey,
    };

    const topUpResult = await transferCurrency(topUpRequest);

    if (topUpResult.isSuccess) return new Response("", { status: 200 });

    return new Response(topUpResult.getErrorOrMessage(), { status: 400 });
  } catch (error) {
    return new Response("Something went wrong!", { status: 500 });
  }
});
