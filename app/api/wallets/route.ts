import { NextResponse } from "next/server";
import auth from "../auth";
import { getWallets } from "./getWallets";
import createWallet, { WalletCreateRequest } from "./createWallet";
import { validate } from "./validations";
import { JwtPayload } from "jsonwebtoken";

export const GET = auth(async (request, tokenPayload) => {
  const { sub } = tokenPayload as JwtPayload;
  const data = await getWallets({ userId: sub! });

  if (data.isSuccess) return NextResponse.json(data.value);

  return new Response(data.getErrorOrMessage(), { status: 500 });
});

export const POST = auth(async (request, tokenPayload) => {
  try {
    const { sub } = tokenPayload as JwtPayload;
    const { name, currency } = await request.json();

    const validationResult = validate({ name, currency });
    if (!validationResult.isSuccess)
      return new Response(validationResult.getErrorOrMessage(), {
        status: 400,
      });

    const createWalletRequest: WalletCreateRequest = {
      userId: sub!,
      name,
      currency,
    };
    const result = await createWallet(createWalletRequest);

    if (result.isSuccess) return NextResponse.json(result.value);

    let error = result.getErrorOrMessage();

    return new Response(error, { status: 500 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong!", { status: 500 });
  }
});
