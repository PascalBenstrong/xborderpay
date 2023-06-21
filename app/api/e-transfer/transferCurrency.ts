import { transferHbar } from "../hedera/transferHbar";
import { validateCurrency } from "../wallets/validations";
import { getWalletById } from "../wallets/getWallets";
import wallets from "../wallets/wallets.db";
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
import { Hbar, HbarUnit } from "@hashgraph/sdk";
import { wrapInTryCatch } from "@/utils/errorHandling";
import transactions from "../transactions/transactions.db";

const fixed = (value: number) => Math.floor(value * 100) / 100;
const maxTopUpAmount = 5000;
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
  toUserId?: string;
  reference?: string;
  type: TransactionType;
};

declare type TransferRequest = {
  fromPrivateKey: string;
  fromWalletId: string;
  amount: number;
  toWalletId: string;
  reference?: string;
};

const validateTransferRequest = (
  request: TransferRequest
): Option<TransferRequest> => {
  if (!ObjectId.isValid(request.toWalletId))
    return Option.fromError(new Error("Invalid wallet id!"));

  if (!ObjectId.isValid(request.fromWalletId))
    return Option.fromError(new Error("Invalid fromWalletId!"));

  if (!requiredStringSchema.safeParse(request.fromPrivateKey).success)
    return Option.fromError(new Error("Invalid privateKey!"));

  const amountValidation = amountSchema.safeParse(request.amount);

  if (!amountValidation.success)
    return Option.fromError(
      new Error(
        `Invalid amount, amount should be at least ${minTopUpAmount} and at most ${maxTopUpAmount}!`
      )
    );

  return Option.fromValue({ ...request, amount: amountValidation.data });
};

declare type TopUpRequest = {
  fromPrivateKey: string;
  fromAccountId: string;
  fromCurrency?: Currency;
  amount: number;
  toWalletId: string;
  toUserId: string;
};

const validateTopUpRequest = (request: TopUpRequest): Option<TopUpRequest> => {
  if (!ObjectId.isValid(request.toWalletId))
    return Option.fromError(new Error("Invalid wallet id!"));

  if (!ObjectId.isValid(request.toUserId))
    return Option.fromError(new Error("Invalid toUserId!"));

  if (!requiredStringSchema.safeParse(request.fromPrivateKey).success)
    return Option.fromError(new Error("Invalid privateKey!"));

  if (!requiredStringSchema.safeParse(request.fromAccountId).success)
    return Option.fromError(
      new Error("Invalid accountId! accountId is required when topping up.")
    );

  if (request.fromCurrency !== undefined) {
    const currencyValidationResult = validateCurrency(request.fromCurrency);
    if (!currencyValidationResult.isSuccess)
      return Option.fromErrorOption(currencyValidationResult);
  }

  const amountValidation = amountSchema.safeParse(request.amount);

  if (!amountValidation.success)
    return Option.fromError(
      new Error(
        `Invalid amount, amount should be at least ${minTopUpAmount} and at most ${maxTopUpAmount}!`
      )
    );

  return Option.fromValue({ ...request, amount: amountValidation.data });
};

declare type ConvertAmountToWalletCurrency = {
  sendingAmount: number;
  sendingCurrency: Currency;
  receivingCurrency: Currency;
};

declare type ConvertedAmount = {
  receivingAmount: number;
  sendingCurrency: Currency;
  sendingHbars: Hbar;
  rate: number;
};
const convertRates = async ({
  sendingAmount,
  sendingCurrency,
  receivingCurrency,
}: ConvertAmountToWalletCurrency): Promise<Option<ConvertedAmount>> => {
  const ratesResult = await getRates(sendingCurrency);

  if (!ratesResult.isSuccess) return Option.fromErrorOption(ratesResult);

  const { rates } = ratesResult.value!;

  const convertToUSDFromBase = (base: Currency, amount: number) => {
    const rate = rates[Currency.USD] / rates[base];
    return amount * rate;
  };

  const sendingHbars = fromHbarToTinyBar(
    convertToUSDFromBase(sendingCurrency, sendingAmount)
  );

  if (sendingCurrency === receivingCurrency) {
    return Option.fromValue({
      receivingAmount: sendingAmount,
      sendingCurrency: sendingCurrency,
      sendingHbars,
      rate: 1,
    });
  }

  const rate = rates[receivingCurrency];
  const receivingAmount = rate * sendingAmount;

  return Option.fromValue({
    receivingAmount,
    sendingCurrency,
    sendingHbars,
    rate,
  });
};

const fromHbarToTinyBar = (value: number) => {
  return Hbar.fromTinybars(HbarUnit.Hbar._tinybar.times(value).integerValue());
};

const topUp = wrapInTryCatch<Transaction, TopUpRequest>(async (data) => {
  const validationResult = validateTopUpRequest(data);

  if (!validationResult.isSuccess)
    return Option.fromErrorOption(validationResult);

  const values = validationResult.value!;

  const walletResult = await getWalletById(data.toWalletId);

  //console.log("walletResult:",walletResult)

  if (!walletResult.isSuccess) return Option.fromErrorOption(walletResult);

  const wallet = walletResult.value!;

  if (data.toUserId !== wallet.userId)
    return Option.fromError(new Error("wallet does not belong to this user!"));

  //console.log("wallet:",wallet)

  const convertedAmountResult = await convertRates({
    sendingAmount: values.amount,
    sendingCurrency: values.fromCurrency ?? wallet.currency,
    receivingCurrency: wallet.currency,
  });

  //console.log("convertedAmountResult:", convertedAmountResult);
  if (!convertedAmountResult.isSuccess)
    return Option.fromErrorOption(convertedAmountResult);

  const { receivingAmount, sendingCurrency, sendingHbars, rate } =
    convertedAmountResult.value!;

  // transfer hbar

  const fromAccountId = values.fromAccountId;

  const topUpResult = await transferHbar({
    amount: sendingHbars,
    toAccountId: wallet.account.id,
    fromAccountId,
    fromAccountPrivateKey: values.fromPrivateKey,
  });

  if (!topUpResult.isSuccess) return Option.fromErrorOption(topUpResult);

  // store the transaction in db

  const id = new ObjectId();

  const transactionId = topUpResult.value!.id;
  const timestamp = Date.now();
  const senderWallet = {
    id: "xborderpay",
    name: "xborderpay",
    userId: "xborderpay",
    currency: sendingCurrency,
  };
  const receivingWallet = {
    id: new ObjectId(wallet.id),
    name: wallet.name,
    currency: wallet.currency,
    userId: new ObjectId(wallet.userId),
  };
  let trans: Transaction | any = {
    type: TransactionType.Deposit,
    senderWallet,
    receivingWallet,
    amount: values.amount,
    timestamp,
    transactionId,
    rate,
    fees: { currency: Currency.USD, amount: 0.07 },
    reference: "top up",
  };

  const insertResult = await transactions.insertOne({ ...trans, _id: id });

  if (!insertResult.acknowledged)
    return Option.fromError(new Error("Something went wrong!"));

  //update wallet balance, this can be computed from the transactions as well

  await wallets.updateOne(
    { _id: new ObjectId(data.toWalletId) },
    { $inc: { balance: receivingAmount } }
  );

  trans.id = id.toString();

  return Option.fromValue(trans);
});

const transferCurrency = wrapInTryCatch<Transaction, TransferCurrencyRequest>(
  async (data) => {
    if (data.type === TransactionType.Deposit) {
      const topUpResult = await topUp({
        ...data,
        fromAccountId: data.fromAccountId!,
        toUserId: data.toUserId!,
      });

      if (topUpResult.isSuccess) return Option.fromValue({});

      return Option.fromErrorOption(topUpResult);
    }

    const validationResult = validateTransferRequest({
      ...data,
      fromWalletId: data.fromWalletId!,
    });

    if (!validationResult.isSuccess)
      return Option.fromErrorOption(validationResult);

    const values = validationResult.value!;
    const walletResult = await getWalletById(values.toWalletId);

    //console.log("walletResult:",walletResult)

    if (!walletResult.isSuccess) return Option.fromErrorOption(walletResult);

    const toWallet = walletResult.value!;

    //console.log("wallet:",wallet)
    const fromWalletResult = await getWalletById(data.fromWalletId!);
    if (!fromWalletResult.isSuccess)
      return Option.fromErrorOption(fromWalletResult);

    const fromWallet = fromWalletResult.value!;

    if (fromWallet.balance < values.amount)
      return Option.fromError(
        new Error(
          "You have insufficient funds in your wallet to process this transfer, \nplease topup and try again later!"
        )
      );

    const convertedAmountResult = await convertRates({
      sendingAmount: values.amount,
      sendingCurrency: fromWallet.currency,
      receivingCurrency: toWallet.currency,
    });

    //console.log("convertedAmountResult:", convertedAmountResult);
    if (!convertedAmountResult.isSuccess)
      return Option.fromErrorOption(convertedAmountResult);

    const { receivingAmount, sendingCurrency, sendingHbars, rate } =
      convertedAmountResult.value!;

    // transfer hbar

    const topUpResult = await transferHbar({
      amount: sendingHbars,
      toAccountId: toWallet.account.id,
      fromAccountId: fromWallet.account.id,
      fromAccountPrivateKey: values.fromPrivateKey,
    });

    if (!topUpResult.isSuccess) return Option.fromErrorOption(topUpResult);

    // store the transaction in db

    const id = new ObjectId();

    const transactionId = topUpResult.value!.id;
    const timestamp = Date.now();
    const senderWallet = {
      id: new ObjectId(fromWallet.id),
      name: fromWallet.name,
      currency: sendingCurrency,
      userId: new ObjectId(fromWallet.userId),
    };
    const receivingWallet = {
      id: new ObjectId(toWallet.id),
      name: toWallet.name,
      currency: toWallet.currency,
      userId: new ObjectId(toWallet.userId),
    };
    let trans: Transaction | any = {
      type: data.type,
      senderWallet,
      receivingWallet,
      amount: values.amount,
      timestamp,
      transactionId,
      rate,
      fees: { currency: Currency.USD, amount: 0.07 },
      reference: data.reference,
    };

    //console.log("inserting")
    const insertResult = await transactions.insertOne({ ...trans, _id: id });

    if (!insertResult.acknowledged)
      return Option.fromError(new Error("Something went wrong!"));

    //update wallet balance, this can be computed from the transactions as well

    const updates = [
      wallets.updateOne(
        { _id: new ObjectId(toWallet.id) },
        { $inc: { balance: receivingAmount } }
      ),
      wallets.updateOne(
        { _id: new ObjectId(fromWallet.id) },
        { $inc: { balance: -values.amount } }
      ),
    ];
    await Promise.all(updates);

    trans.id = id.toString();

    return Option.fromValue(trans);
  }
);

export default transferCurrency;
