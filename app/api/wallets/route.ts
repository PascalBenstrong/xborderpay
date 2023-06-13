import { NextResponse } from "next/server";
import { Wallet } from "../../types";

import * as accounts from "../accounts/register";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const r = accounts.register;

  const data: Wallet[] = [
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

  return NextResponse.json({ data });
}
