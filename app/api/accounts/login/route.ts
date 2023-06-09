import { NextResponse } from "next/server";
import { login } from "./login";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const result = await login(email, password);

    if (result.isSuccess) return NextResponse.json(result.value);

    let error = result.getErrorOrMessage();

    return new Response(error, { status: 400 });
  } catch (error) {
    return new Response("Something went wrong!", { status: 500 });
  }
}
