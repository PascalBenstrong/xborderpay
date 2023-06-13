import { constructor } from "@hashgraph/sdk/lib/EntityIdHelper";

export enum Currency {
  USD,
  EUR,
  GBP,
  BTC,
  ETH,
  ZAR,
  HBAR,
}

export type Transaction = {
  id: string;
  type: string;
  to?: string;
  wallet: string;
  currency: string;
  amount: number;
  timestamp: number;
};

export type Wallet = {
  id: string;
  name: string;
  currency: string;
  balance: number;
  logo: string;
};

export type User = {
  firstName: string;
  lastName: string;
  email: string;
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
    }

    this.status = "Success";

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
