import wallets from "./wallets.db";
import { Currency, Option, Wallet, WalletAccount } from "@/types";
import { wrapInTryCatch } from "@/utils/errorHandling";
import { ObjectId } from "mongodb";

export declare type WalletsRequest = {
  userId: string;
};
export const getWallets = wrapInTryCatch<Wallet[], WalletsRequest>(
  async (request) => {
    let _wallets: Array<any> = await wallets
      .find({
        userId: new ObjectId(request.userId),
      })
      .toArray();

    _wallets = _wallets.map((x) => {
      x.id = x._id;
      x.userId = x.userId.toString();
      delete x._id;

      return x as Wallet;
    });

    return Option.fromValue(_wallets);
  }
);
