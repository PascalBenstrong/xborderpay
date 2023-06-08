export enum Currency {
    USD = "USD", EUR = "EUR", GBP = "GBP", BTC = "BTC", ETH = "ETH", ZAR = "ZAR", HBAR = "HBAR"
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
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    birthdate: string,
    fiId: string,
    accountNo: string,
    bankName: string,
    address: string,
}
