import wallets from "./wallets.db";
import { Option, Wallet } from "@/types";
import { wrapInTryCatch } from "@/utils/errorHandling";
import deleteAccount from "../hedera/deleteAccount";
import { ObjectId } from "mongodb";

export declare type WalletDeleteRequest = {
  id: string;
  userId: string;
  privateKey: string;
};

const deleteWallet = wrapInTryCatch<boolean, WalletDeleteRequest>(
  async (request) => {
    // get wallet from db

    if (!ObjectId.isValid(request.id))
      return Option.fromError(new Error("Wallet id is not valid!"));
    if (!ObjectId.isValid(request.userId))
      return Option.fromError(new Error("userId is not valid!"));

    const wallet = await wallets().findOne({
      _id: new ObjectId(request.id),
      userId: new ObjectId(request.userId),
    });
    
    if (!wallet) return Option.fromValue(true);

    const deleteAccountResult = await deleteAccount({
      privateKey: request.privateKey,
      accountId: wallet.account.id,
    });

    if (!deleteAccountResult.isSuccess) return deleteAccountResult;

    const deleteResult = await wallets().deleteOne({ _id: wallet._id });

    if (deleteResult.acknowledged && deleteResult.deletedCount === 1)
      return Option.fromValue(true);

    return Option.fromError(
      new Error("failed to delete wallet try again latter!")
    );
  }
);

export default deleteWallet;
