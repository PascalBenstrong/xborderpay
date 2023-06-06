export enum Currency {
    USD, EUR, GBP, BTC, ETH, ZAR,HBAR
}

export type Transaction = {
    id: string;
    type: string;
    to?: string;
    wallet: string;
    currency: string;
    amount: number;
    timestamp: number;
}

export type Wallet = {
    id: string,
    name: string,
    currency: string,
    balance: number,
    logo: string,
}

export type User = {
    firstName: string,
    lastName: string,
    email: string
}
