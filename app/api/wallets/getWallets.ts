import wallets from "./wallets.db";
import { Currency, Option, Wallet, WalletAccount } from "@/types";
import { wrapInTryCatch } from "@/utils/errorHandling";

export declare type WalletsRequest = {
  userId: string;
};
export const getWallets = wrapInTryCatch<Wallet[], WalletsRequest>(
  async (request) => {
    let _wallets: Array<any> = await wallets
      .find({
        userId: request.userId,
      })
      .toArray();

    _wallets = _wallets.map((x) => {
      x.id = x._id;
      delete x._id;

      return x as Wallet;
    });

    return Option.fromValue(_wallets);
  }
);
