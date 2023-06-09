import zod from "zod";

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  ZAR = "ZAR",
}

declare type TransactionWallet = {
  name: string | "xborderpay";
  id: string | "xborderpay";
  currency: Currency;
  userId: string | "xborderpay";
};

export enum TransactionType {
  Transfer = "Transfer",
  Deposit = "Deposit",
  WithDrawl = "Withdrawal",
}

declare type Fee = {
  currency: Currency;
  amount: number;
};
export type Transaction = {
  id: string;
  type: TransactionType;
  senderWallet: TransactionWallet;
  receivingWallet: TransactionWallet;
  amount: number;
  timestamp: number;
  transactionId: string;
  rate: number;
  fees?: Fee;
  reference?: string;
};

export type AccountType = "hedera";

export type WalletAccount = {
  id: string;
  publicKey: string;
  type: AccountType;
};

export type iWallet = {
  name: string;
  currency: Currency;
};

export type Wallet = iWallet & {
  id: string;
  balance: number;
  logo?: string;
  userId: string;
  account: WalletAccount;
};

export type User = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthdate?: string;
  address?: string;
};

export const IntSchema = zod
  .number()
  .transform((x) => Math.max(1, Math.ceil(x)));
export type Int = zod.infer<typeof IntSchema>;
export type Order = "asc" | "desc";
export type TransactionsRequest = {
  userId: string;
  order?: Order | null;
  limit?: Int | null;
  after?: string | null;
  before?: string | null;
};

export type ETransferRequest = {
  fromWalletId: string;
  fromPrivateKey: string;
  fromCurrency: Currency;
  amount: number;
  toWalletId: string;
  toCurrency: Currency;
  reference: string;
};

export type WalletTopupRequest = {
  toWalletId: string;
  fromCurrency: Currency;
  amount: number;
};

declare type Transfer = {
  account: string;
  amount: number;
  is_approval: boolean;
};

declare type HederaTransactionResponse = {
  charged_tx_fee: number;
  consensus_timestamp: string;
  entity_id: string;
  max_fee: number;
  name: string;
  result: string;
  transaction_id: string;
  transfers: Transfer[];
};
export type HederaTransactionsResponse = {
  links: { next?: string };
  transactions: HederaTransactionResponse[];
};

export type TransactionsResponse = {
  next?: string;
  transactions: Transaction[];
};

export class Option<T> {
  public readonly value?: T;
  public readonly error?: Error | zod.ZodError | any;
  public readonly message?: string;

  public readonly status: "Error" | "Success";

  public get isSuccess(): boolean {
    return this.status === "Success";
  }

  private constructor(
    value: T | undefined,
    error: Error | zod.ZodError | any | undefined,
    message: string | undefined
  ) {
    this.value = value;

    if (!value) {
      this.status = "Error";
      this.error = error;
    } else {
      this.status = "Success";
    }

    this.message = message;

    Object.freeze(this);
  }

  getErrorOrMessage() {
    if (this.message) return this.message;

    if (this.error?.message) return this.error?.message;

    return this.error;
  }

  static fromValue<T>(value: T) {
    return new Option<T>(value, undefined, undefined);
  }

  static fromValueAndMessage<T>(value: T, message: string) {
    return new Option<T>(value, undefined, message);
  }
  static fromError<T>(error: Error | zod.ZodError | any) {
    return new Option<T>(undefined, error, undefined);
  }
  static fromErrorOption<T>(option: Option<any>) {
    return new Option<T>(undefined, option.error, option.message);
  }
  static fromErrorAndMessage<T>(
    error: Error | zod.ZodError | any,
    message: string
  ) {
    return new Option<T>(undefined, error, message);
  }
}
