import { transferHbar } from "../hedera/transferHbar";
import { validateCurrency } from "../wallets/validations";
import { getWalletById } from "../wallets/getWallets";
import { getRates } from "../rates/getRates";
import zod from "zod";
import {
  Currency,
  Option,
  Transaction,
  TransactionType,
  Wallet,
} from "@/types";
import { ObjectId } from "mongodb";
import { Hbar } from "@hashgraph/sdk";
import { wrapInTryCatch } from "@/utils/errorHandling";
import transactions from "../transactions/transactions.db";

const fixed = (value: number) => Math.floor(value * 100) / 100;
const maxTopUpAmount = 100;
const minTopUpAmount = 1;
const requiredStringSchema = zod.string().min(1);
const amountSchema = zod
  .number()
  .min(minTopUpAmount)
  .max(maxTopUpAmount)
  .transform(fixed);

declare type TransferCurrencyRequest = {
  fromPrivateKey: string;
  fromAccountId?: string;
  fromCurrency?: Currency;
  fromWalletId?: string;
  amount: number;
  toWalletId: string;
  toUserId: string;
  reference?: string;
  type: TransactionType;
};

declare type TransferCurrencyResponse = {};

const validateRequest = (
  request: TransferCurrencyRequest
): Option<TransferCurrencyRequest> => {
  if (!ObjectId.isValid(request.toWalletId))
    return Option.fromError(new Error("Invalid wallet id!"));

  if (!ObjectId.isValid(request.toUserId))
    return Option.fromError(new Error("Invalid toUserId!"));

  if (request.fromWalletId && !ObjectId.isValid(request.fromWalletId))
    return Option.fromError(new Error("Invalid fromWalletId!"));

  if (!requiredStringSchema.safeParse(request.fromPrivateKey).success)
    return Option.fromError(new Error("Invalid privateKey!"));

  if (
    !request.fromWalletId &&
    !requiredStringSchema.safeParse(request.fromAccountId).success
  )
    return Option.fromError(
      new Error(
        "Invalid accountId! accountId is required when not providing fromWalletId."
      )
    );

  if (request.fromCurrency) {
    const currencyValidationResult = validateCurrency(request.fromCurrency);
    if (!currencyValidationResult.isSuccess)
      return Option.fromErrorOption(currencyValidationResult);
  }

  const amountValidation = amountSchema.safeParse(request.amount);

  if (!amountValidation.success)
    return Option.fromError(
      new Error("Invalid amount, amount should be at least 1 and at most 100!")
    );

  return Option.fromValue({ ...request, amount: amountValidation.data });
};

declare type ConvertAmountToWalletCurrency = {
  amount: number;
  base?: Currency;
  walletCurrency: Currency;
};

declare type ConvertedAmount = {
  amount: number;
  from?: Currency;
  rate: number;
};
const convertRates = async ({
  amount,
  base,
  walletCurrency,
}: ConvertAmountToWalletCurrency): Promise<Option<ConvertedAmount>> => {
  if (base == undefined || base === walletCurrency)
    return Option.fromValue({ amount: amount, rate: 1 });

  const ratesResult = await getRates(base);

  if (!ratesResult.isSuccess) return Option.fromErrorOption(ratesResult);

  const { rates } = ratesResult.value!;
  const rate = rates[walletCurrency];
  amount = amount * rate;
  return Option.fromValue({ amount, rate, from: base });
};

const transferCurrency = wrapInTryCatch<
  TransferCurrencyResponse,
  TransferCurrencyRequest
>(async (data) => {
  const validationResult = validateRequest(data);

  if (!validationResult.isSuccess)
    return Option.fromErrorOption(validationResult);

  const values = validationResult.value!;
  const _walletId = values.type === TransactionType.Transfer ? values.fromWalletId! : values.toWalletId;
  const walletResult = await getWalletById(_walletId);

  if (!walletResult.isSuccess) return Option.fromErrorOption(walletResult);

  const wallet = walletResult.value!;

  if (data.toUserId !== wallet.userId)
    return Option.fromError(new Error("wallet does not belong to this user!"));

  let fromWallet: Wallet | undefined;

  if (data.fromWalletId) {
    const fromWalletResult = await getWalletById(data.fromWalletId);

    if (!fromWalletResult.isSuccess)
      return Option.fromErrorOption(fromWalletResult);

    fromWallet = fromWalletResult.value!;

    values.fromCurrency = fromWallet.currency;

    if (fromWallet.balance < values.amount)
      return Option.fromError(new Error("You have insufficient funds in your wallet to process this transfer, \nplease topup and try again later!"));
  }

  const convertedAmountResult = await convertRates({
    amount: values.amount,
    base: values.fromCurrency,
    walletCurrency: wallet.currency,
  });

  if (!convertedAmountResult.isSuccess)
    return Option.fromErrorOption(convertedAmountResult);

  const { amount, from, rate } = convertedAmountResult.value!;

  // transfer hbar

  const fromAccountId = fromWallet?.account.id ?? values.fromAccountId!;

  const topUpResult = await transferHbar({
    amount: new Hbar(amount),
    toAccountId: wallet.account.id,
    fromAccountId,
    fromAccountPrivateKey: values.fromPrivateKey,
  });

  console.log("fromWallet1: ", topUpResult)
  if (!topUpResult.isSuccess) return Option.fromErrorOption(topUpResult);

  // store the transaction in db

  const id = new ObjectId();

  const currency = from != undefined ? from : wallet.currency;
  const transactionId = topUpResult.value!.id;
  const timestamp = Date.now();
  const senderWallet = {
    id: fromWallet?.id ?? "xborderpay",
    name: fromWallet?.name ?? "xborderpay",
    currency: currency,
  };
  const receivingWallet = {
    id: wallet.id,
    name: wallet.name,
    currency: wallet.currency,
  };
  let trans: Transaction | any = {
    type: data.type,
    senderWallet,
    receivingWallet,
    amount,
    timestamp,
    transactionId,
    userId: wallet.userId,
    rate,
    fees: { currency: Currency.USD, amount: 0.07 },
    reference: data.reference,
  };

  const insertResult = await transactions.insertOne({ ...trans, _id: id });

  if (!insertResult.acknowledged)
    return Option.fromError(new Error("Something went wrong!"));

  trans.id = id.toString();

  return Option.fromValue(trans);
});

export default transferCurrency;
