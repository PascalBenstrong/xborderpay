import client from "./client";
import {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  TransferTransaction,
  Status,
} from "@hashgraph/sdk";
import { Option } from "@/types";

declare type AccountCreateResponse = {
  privateKey: string;
  publicKey: string;
  accountId: string;
};

function wrapInTryCatch<T, Tin>(
  func: (data: Tin) => Promise<Option<T>>
): (data: Tin) => Promise<Option<T>> {
  return async (data: Tin) => {
    try {
      return await func(data);
    } catch (error) {
      return Option.fromErrorAndMessage(error, "Something went wrong!");
    }
  };
}

function wrapInTryCatchVoid<T>(
  func: () => Promise<Option<T>>
): () => Promise<Option<T>> {
  return async () => {
    try {
      return await func();
    } catch (error) {
      return Option.fromErrorAndMessage(error, "Something went wrong!");
    }
  };
}

export const createAccount = wrapInTryCatchVoid<AccountCreateResponse>(
  async () => {
    const newPrivateKey = await PrivateKey.generateED25519Async();
    const newPublicKey = newPrivateKey.publicKey;
    const account = await new AccountCreateTransaction()
      .setKey(newPublicKey)
      .execute(client);

    const receipt = await account.getReceipt(client);

    const accountId = receipt.accountId;

    if (!accountId)
      return Option.fromError(
        new Error("Failed to create new account. Try again later.")
      );

    const response: AccountCreateResponse = {
      privateKey: newPrivateKey.toStringDer(),
      publicKey: newPublicKey.toStringDer(),
      accountId: accountId.toString(),
    };

    return Option.fromValue(response);
  }
);

export const getBalanceHbar = wrapInTryCatch<Hbar, string>(async (accountId) => {
  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(accountId)
    .execute(client);

  return Option.fromValue(accountBalance.hbars);
});

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
  const signed = await new TransferTransaction()
    .addHbarTransfer(
      request.fromAccountId,
      request.amount.isNegative() ? request.amount : request.amount.negated()
    )
    .addHbarTransfer(
      request.toAccountId,
      request.amount.isNegative() ? request.amount.negated() : request.amount
    )
    .setMaxTransactionFee(new Hbar(100))
    .sign(PrivateKey.fromStringED25519(request.fromAccountPrivateKey));

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
