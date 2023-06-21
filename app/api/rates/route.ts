import { NextResponse } from "next/server";
import { Currency } from "../../types";
import { getRates } from "./getRates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const base = searchParams.get("base") || Currency.USD;

  const response = await getRates(base as Currency);

  if (!response.isSuccess)
    return new Response(response.getErrorOrMessage(), { status: 400 });
  return NextResponse.json(response.value);
}
