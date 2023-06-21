import client from "./client";
import { PrivateKey, Hbar, TransferTransaction, Status } from "@hashgraph/sdk";
import { Option } from "@/types";

import { wrapInTryCatch } from "@/utils/errorHandling";

declare type TransferHbarRequest = {
  amount: Hbar;
  fromAccountId: string;
  fromAccountPrivateKey: string;
  toAccountId: string;
};
declare type TransferHBarRequestResponse = { id: string };
export const transferHbar = wrapInTryCatch<
  TransferHBarRequestResponse,
  TransferHbarRequest
>(async (request) => {

  console.log(request)
  const signed = new TransferTransaction()
    .addHbarTransfer(
      request.fromAccountId,
      request.amount.isNegative() ? request.amount : request.amount.negated()
    )
    .addHbarTransfer(
      request.toAccountId,
      request.amount.isNegative() ? request.amount.negated() : request.amount
    )
    .setMaxTransactionFee(new Hbar(100))
    //.sign(PrivateKey.fromStringED25519(request.fromAccountPrivateKey));
    
    console.log("signed: ",signed)
  const transaction = await signed.execute(client);

  console.log("transaction: ",transaction.toJSON())

  const receipt = await transaction.getReceipt(client);

  if (receipt.status === Status.Success)
    return Option.fromValue({ id: transaction.transactionId.toString() });

  if (
    receipt.status === Status.InsufficientPayerBalance ||
    receipt.status === Status.InsufficientAccountBalance
  )
    return Option.fromError(
      new Error("Insufficient account balance for this transaction!")
    );

  return Option.fromError(new Error("Something went wrong!"));
});
