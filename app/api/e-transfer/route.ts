import { NextResponse } from "next/server";
import { Currency, ETransferRequest, TransactionType, User, Wallet } from "../../types";
import transferCurrency from "./transferCurrency";
import auth from "../auth";
import { JwtPayload } from "jsonwebtoken";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const accounts: Wallet[] = [
        {
            userId: "648f2dc74469b5d1e702451e",
            currency: Currency.USD,
            name: "USD",
            account: {
                id: "0.0.14826128",
                publicKey: "302a300506032b657003210080274d459fcbda0e569f4c250bdc3ad632832947e081eb18817052257b3c67fc",
                type: "hedera"
            },
            balance: 500,
            id: "648f2dc94469b5d1e702451f"
        },
        {
            userId: "648f2dc74469b5d1e702451e",
            name: "ZAR Wallet",
            currency: Currency.ZAR,
            account: {
                id: "0.0.14827473",
                publicKey: "302a300506032b65700321004f256f5baa993fcaf5dc623a2d4f98ec4e477cb8cfe1d77fd95280225abdfcca",
                type: "hedera"
            },
            balance: 2000,
            id: "648f9ea5ef1d4e69bf3d7dbd"
        }
    ];

    const user = {
        firstName: "Mark",
        lastName: "Woods",
        email: "mark.wood@gmail.com",
        wallets: accounts,
    }

    const purposes: string[] = [
        "Software development services",
        "Infrastructure maintenance and support",
        "Cloud hosting and storage",
        "Software licensing and subscriptions",
        "IT consulting and advisory"
    ];

    const data = {
        accounts,
        user,
        purposes
    }

    return NextResponse.json({ ...data });

}

export const POST = auth(async (request, tokenPayload) => {
    try {
        const { sub } = tokenPayload as JwtPayload;
        const data = await request.json();

        const eTransferRequest = {
            ...data,
            toUserId: sub!,
            type: TransactionType.Transfer,
        };
        const eTransferResult = await transferCurrency(eTransferRequest);

        if (eTransferResult.isSuccess) return new Response("", { status: 200 });

        return new Response(eTransferResult.getErrorOrMessage(), { status: 400 });
    } catch (error) {
        return new Response("Something went wrong!", { status: 500 });
    }
});
