import client, { operatorAccountId } from "./client";
import {
  PrivateKey,
  AccountBalanceQuery,
  Status,
  AccountDeleteTransaction,
} from "@hashgraph/sdk";
import { Option } from "@/types";

import { wrapInTryCatch } from "@/utils/errorHandling";

declare type AccountDeleteRequest = {
  privateKey: string;
  accountId: string;
};

const deleteAccount = wrapInTryCatch<boolean, AccountDeleteRequest>(
  async (request) => {
    const privateKey = PrivateKey.fromStringED25519(request.privateKey);

    const balanceResponse = await new AccountBalanceQuery()
      .setAccountId(request.accountId)
      .execute(client);

    if (balanceResponse.hbars.toTinybars().greaterThan(0))
      return Option.fromError(
        new Error("Can not delete account with positive balance!")
      );
    const deleteTransaction = new AccountDeleteTransaction()
      .setAccountId(request.accountId)
      .setTransferAccountId(operatorAccountId)
      .freezeWith(client);

    const signedDeleteTransaction = await deleteTransaction.sign(privateKey);

    const deleteResponse = await signedDeleteTransaction.execute(client);

    const receipt = await deleteResponse.getReceipt(client);

    if (receipt.status === Status.AccountIdDoesNotExist)
      return Option.fromValue(true);

    if (receipt.status !== Status.Success)
      return Option.fromError(
        new Error("Failed to delete account try again later!")
      );

    return Option.fromValue(true);
  }
);

export default deleteAccount;
