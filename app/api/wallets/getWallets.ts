import wallets from "./wallets.db";
import { Currency, Option, Wallet, WalletAccount } from "@/types";
import { wrapInTryCatch } from "@/utils/errorHandling";
import { ObjectId } from "mongodb";

export declare type WalletsRequest = {
  userId: string;
};
export const getWallets = wrapInTryCatch<Wallet[], WalletsRequest>(
  async (request) => {
    if (!ObjectId.isValid(request.userId))
      return Option.fromError(new Error("Invalid userId!"));
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
export const getWalletById = wrapInTryCatch<Wallet, string>(async (id) => {
  if (!ObjectId.isValid(id))
    return Option.fromError(new Error("Invalid wallet id!"));
  let _wallet: any = await wallets.findOne({
    _id: new ObjectId(id),
  });

  _wallet.id = _wallet._id.toString();
  _wallet.userId = _wallet.userId.toString();
  delete _wallet._id;

  return Option.fromValue(_wallet as Wallet);
});
