import client from "./client";
import { PrivateKey, AccountCreateTransaction } from "@hashgraph/sdk";
import { Option } from "@/types";
import { wrapInTryCatchVoid } from "@/utils/errorHandling";

declare type AccountCreateResponse = {
  privateKey: string;
  publicKey: string;
  accountId: string;
};

const createAccount = wrapInTryCatchVoid<AccountCreateResponse>(async () => {
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
});

export default createAccount;
