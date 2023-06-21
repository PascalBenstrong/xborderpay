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

  const amountToSend = request.amount.isNegative() ? request.amount : request.amount.negated();
  const amountToReceive = amountToSend.negated();
  const transferTransaction = new TransferTransaction()
    .addHbarTransfer(
      request.fromAccountId,
      amountToSend
    )
    .addHbarTransfer(
      request.toAccountId,
      amountToReceive
    )
    .setMaxTransactionFee(new Hbar(100))
    .freezeWith(client);

    const signed = await transferTransaction.sign(PrivateKey.fromString(request.fromAccountPrivateKey));

    const transaction = await signed.execute(client);
    
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
