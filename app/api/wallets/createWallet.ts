import wallets from "./wallets.db";
import { Currency, Option, Wallet, WalletAccount } from "@/types";
import { wrapInTryCatch } from "@/utils/errorHandling";
import createAccount from "../hedera/createAccount";
import { ObjectId } from "mongodb";

export declare type WalletCreateRequest = {
  userId: string;
  currency: Currency;
  name: string;
};

export declare type WalletCreateResponse = {
  privateKey: string;
  wallet: Wallet;
};
const createWallet = wrapInTryCatch<WalletCreateResponse, WalletCreateRequest>(
  async (request) => {
    // create a new hedera account for this user

    const createAccountResult = await createAccount();

    if (!createAccountResult.isSuccess)
      return Option.fromError(
        new Error("Failed to create a new hedera account. Contact support!")
      );

    const account = createAccountResult.value!;

    const walletAccount: WalletAccount = {
      id: account.accountId,
      publicKey: account.publicKey,
      type: "hedera",
    };

    let wallet: any = await wallets.findOne({
      currency: request.currency,
      userId: request.userId,
    });

    if (wallet)
      return Option.fromError(
        new Error("Wallet for this currency already exists!")
      );

    const id = new ObjectId();
    wallet = {
      ...request,
      account: walletAccount,
      balance: 0,
      _id: id,
    };

    const inserted = await wallets.insertOne(wallet);

    if (!inserted.acknowledged)
      return Option.fromError(
        new Error("Failed to create wallet. Try again later!")
      );

    wallet.id = id.toString();

    delete wallet._id;

    return Option.fromValue({ privateKey: account.privateKey, wallet });
  }
);

export default createWallet;