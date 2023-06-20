import auth from "../../../auth";
import deleteWallet from "../../deleteWallet";
import { JwtPayload } from "jsonwebtoken";

import zod from "zod";

const privateKeySchema = zod.string().min(1);

export const POST = auth(
  async (request, tokenPayload, { params }: { params: { id: string } }) => {
    try {
      const { sub } = tokenPayload as JwtPayload;

      const { privateKey } = await request.json();

      if (!privateKeySchema.safeParse(privateKey).success)
        return new Response("Invalid privateKey!", { status: 400 });

      const result = await deleteWallet({
        id: params.id,
        privateKey,
        userId: sub!,
      });

      if (result.isSuccess) return new Response(undefined, { status: 200 });

      let error = result.getErrorOrMessage();

      return new Response(error, { status: 400 });
    } catch (error) {
      console.log(error);
      return new Response("Something went wrong!", { status: 500 });
    }
  }
);
