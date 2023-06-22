import { NextResponse } from "next/server";
import auth from "../auth";
import accounts from "./accounts.db";

export const GET = auth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    if (!searchParams.get("email"))
      return new Response("Invalid email", { status: 400 });

    let agg = [
      {
        $match: {
          email: searchParams.get("email"),
        },
      },
      {
        $lookup: {
          from: "wallet",
          let: {
            userId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$userId"],
                },
              },
            },
            {
              $project: {
                balance: 0,
              },
            },
          ],
          as: "wallets",
        },
      },
      {
        $unset: ["password", "wallets$.balance"],
      },
    ];

    let userWallets: any[] = await accounts().aggregate(agg).toArray();

    userWallets = userWallets.map((x) => {
      x.id = x._id.toString();
      delete (x as any)._id;

      x.wallets = x.wallets.map((w: any) => {
        w.id = w._id.toString();
        delete w._id;
        return w;
      });

      return x;
    });
    return NextResponse.json(userWallets);
  } catch (error) {
    return new Response("Something went wrong!", { status: 500 });
  }
});
