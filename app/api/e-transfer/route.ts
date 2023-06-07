import { NextResponse } from "next/server";
import { User, Wallet } from "../../types";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const accounts: Wallet[] = [
        {
            id: "1",
            name: "Euros",
            currency: "EUR",
            balance: 115741,
            logo: "",
        },
        {
            id: "2",
            name: "US dollar",
            currency: "USD",
            balance: 1005,
            logo: "",
        },
        {
            id: "3",
            name: "South African Rand",
            currency: "ZAR",
            balance: 39134,
            logo: "",
        },
    ];

    const recentPayees: User[] = [
        {
            id: "1",
            firstName: "Euros",
            lastName: "EUR",
            email: "",
        },
        {
            id: "2",
            firstName: "US dollar",
            lastName: "USD",
            email: "",
        },
        {
            id: "3",
            firstName: "South African Rand",
            lastName: "ZAR",
            email: "",
        },
    ];

    const purposes: string[] = [
        "Software development services",
        "Infrastructure maintenance and support",
        "Cloud hosting and storage",
        "Software licensing and subscriptions",
        "IT consulting and advisory"
    ];

    const data = {
        accounts,
        recentPayees,
        purposes
    }

    return NextResponse.json({ ...data });

}
