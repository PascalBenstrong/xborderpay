import { NextResponse } from "next/server";
import { Transaction } from "../../types";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const data: Transaction[] = [
        {
            id: "1",
            type: "deposit",
            to: "John Doe",
            wallet: "USD Wallet",
            currency: "USD",
            amount: 1000,
            timestamp: 1654328700,
        },
        {
            id: "2",
            type: "withdrawal",
            to: "Jane Smith",
            wallet: "EUR Wallet",
            currency: "EUR",
            amount: 500,
            timestamp: 1654329000,
        },
        {
            id: "3",
            type: "transfer",
            to: "Mark Johnson",
            wallet: "GBP Wallet",
            currency: "GBP",
            amount: 250,
            timestamp: 1654329300,
        },
        {
            id: "4",
            type: "withdrawal",
            to: "Alice Johnson",
            wallet: "BTC Wallet",
            currency: "BTC",
            amount: 0.5,
            timestamp: 1654375200,
        },
        {
            id: "5",
            type: "transfer",
            to: "Bob Smith",
            wallet: "ETH Wallet",
            currency: "ETH",
            amount: 2.75,
            timestamp: 1654375500,
        },
        {
            id: "6",
            type: "deposit",
            to: "Charlie Brown",
            wallet: "LTC Wallet",
            currency: "LTC",
            amount: 100,
            timestamp: 1654375800,
        },
    ];

    return NextResponse.json({ data });

}
