import zod from "zod";

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
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
  userId: string;
};

export type AccountType = "hedera";

export type WalletAccount = {
  id: string;
  publicKey: string;
  type: AccountType;
};

export type iWallet ={
  name: string;
  currency: Currency;
}

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
  id: string;
  privateKey: string;
  fromCurrency: string;
  fromAmount: string;
  toWalletId: string;
  toCurrency: string;
  reference: string;
}

export type WalletTopupRequest = {
  id: string;
  fromCurrency: string;
  amount: string;
}

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
  static fromErrorAndMessage<T>(
    error: Error | zod.ZodError | any,
    message: string
  ) {
    return new Option<T>(undefined, error, message);
  }
}
