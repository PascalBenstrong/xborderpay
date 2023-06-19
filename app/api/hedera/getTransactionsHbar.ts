import {
  Option,
  TransactionsResponse,
  TransactionsRequest,
  IntSchema,
  Transaction,
} from "@/types";

import transactions from "../transactions/transactions.db";
import { ObjectId } from "mongodb";

import { wrapInTryCatch } from "@/utils/errorHandling";

const testnetUrl = "https://testnet.mirrornode.hedera.com/api/v1/transactions";
export const getTransactionsHbar = wrapInTryCatch<
  TransactionsResponse,
  TransactionsRequest
>(async (request) => {
  let limit = IntSchema.parse(request.limit || 20);

  //let query = `${testnetUrl}?limit=${limit}&order=${request.order}&account.id=${request.accountId}`;

  //let hederaResultTask = fetch(query).then((x) => x.json());

  let findQuery: any = { userId: request.userId };

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
    .sort({ _id: request.order || "desc" })
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
