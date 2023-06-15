import { login } from "./login";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const result = await login(email, password);

    if (result.isSuccess) return result.value;

    let error: any = !result.message ? result.error : result.message;

    return new Response(error, { status: 400 });
  } catch (error) {
    return new Response("Something went wrong!", { status: 500 });
  }
}
