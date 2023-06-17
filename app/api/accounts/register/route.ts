import { NextResponse } from "next/server";
import { register } from "./register";
import { User } from "@/types";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    const user: User = { firstName, lastName, email };
    const result = await register(user, password);

    if (result.isSuccess) return NextResponse.json(result.value);

    let error = result.getErrorOrMessage();

    return new Response(error, { status: 400 });
  } catch (error) {
    return new Response("Something went wrong!", { status: 500 });
  }
}
