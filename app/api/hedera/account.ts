import client from "./client";
import {
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  TransferTransaction,
  Status,
} from "@hashgraph/sdk";
import {
  Currency,
  Option,
  HederaTransactionsResponse,
  TransactionsResponse,
  TransactionsRequest,
  IntSchema,
  Transaction,
} from "@/types";

import transactions from "../transactions/transactions.db";
import { ObjectId } from "mongodb";

import { wrapInTryCatchVoid, wrapInTryCatch } from "@/utils/errorHandling";

declare type AccountCreateResponse = {
  privateKey: string;
  publicKey: string;
  accountId: string;
};

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

export const getBalanceHbar = wrapInTryCatch<Hbar, string>(
  async (accountId) => {
    const accountBalance = await new AccountBalanceQuery()
      .setAccountId(accountId)
      .execute(client);

    return Option.fromValue(accountBalance.hbars);
  }
);

declare type TransferHbarRequest = {
  amount: Hbar;
  fromAccountId: string;
  fromAccountPrivateKey: string;
  toAccountId: string;
  currency: Currency;
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

const testnetUrl = "https://testnet.mirrornode.hedera.com/api/v1/transactions";
export const getTransactionsHbar = wrapInTryCatch<
  TransactionsResponse,
  TransactionsRequest
>(async (request) => {
  let limit = IntSchema.parse(request.limit || 20);

  //let query = `${testnetUrl}?limit=${limit}&order=${request.order}&account.id=${request.accountId}`;

  //let hederaResultTask = fetch(query).then((x) => x.json());

  let findQuery: any = { accountId: request.accountId };

  if (request.after && request.before) {
    findQuery._id = {
      gt: new ObjectId(request.after),
      lt: new ObjectId(request.before),
    };
  } else if (request.after) {
    findQuery._id = { gt: new ObjectId(request.after) };
  } else if (request.before) {
    findQuery._id = { lt: new ObjectId(request.before) };
  }
  const transQuery = transactions
    .find(findQuery)
    .limit(Math.min(limit, 101))
    .sort({ _id: request.order || "asc" })
    .map((doc) => ({ ...doc, id: doc._id.toString() } as any as Transaction))
    .toArray();

  let trans = await transQuery;

  let nextQuery: undefined | string;

  if (trans.length > limit) {
    trans.pop()!;
    const last = trans[trans.length - 1];

    nextQuery = `?limit=${limit}&order=${request.order}&after=${last.id}`;

    if (request.before) nextQuery += `&before=${request.before}`;
  }

  const response: TransactionsResponse = {
    next: nextQuery,
    transactions: trans,
  };

  return Option.fromValue(response);
});
