import zod from "zod";

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  BTC = "BTC",
  ETH = "ETH",
  ZAR = "ZAR",
}

declare type TransactionWallet = {
  name: string;
  id: string;
  currency: Currency;
};
export type Transaction = {
  id: string;
  type: string;
  to?: string;
  senderWallet: TransactionWallet;
  receivingWallet: TransactionWallet;
  exchangeRate: number;
  amount: number;
  timestamp: number;
  transactionId: string;
};

export type AccountType = "hedera";

export type Wallet = {
  id: string;
  name: string;
  currency: string;
  balance: number;
  logo: string;
  account: { id: string; publicKey: string; type: AccountType };
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthdate: string;
  fiId: string;
  accountNo: string;
  bankName: string;
  address: string;
};

export const IntSchema = zod
  .number()
  .transform((x) => Math.max(1, Math.ceil(x)));
export type Int = zod.infer<typeof IntSchema>;
export type Order = "asc" | "desc";
export type TransactionsRequest = {
  accountId: string;
  order: Order;
  limit: Int;
  after: string;
  before: string;
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
  public readonly error?: Error | any;
  public readonly message?: string;

  public readonly status: "Error" | "Success";

  public get isSuccess(): boolean {
    return this.status === "Success";
  }

  private constructor(
    value: T | undefined,
    error: Error | any | undefined,
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

  static fromValue<T>(value: T) {
    return new Option<T>(value, undefined, undefined);
  }

  static fromValueAndMessage<T>(value: T, message: string) {
    return new Option<T>(value, undefined, message);
  }
  static fromError<T>(error: Error | any) {
    return new Option<T>(undefined, error, undefined);
  }
  static fromErrorAndMessage<T>(error: Error | any, message: string) {
    return new Option<T>(undefined, error, message);
  }
}
