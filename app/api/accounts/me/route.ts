import auth from "@/api/auth";
import { NextResponse } from "next/server";
import accounts from "../accounts.db";
import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const GET = auth(async (request,tokenPayload) => {
  try {
    const { sub } = tokenPayload as JwtPayload;

    let agg = [
      {
        $match: {
          _id: new ObjectId(sub!),
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
          ],
          as: "wallets",
        },
      },
      {
        $unset: ["password"],
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
    return NextResponse.json(userWallets[0]);
  } catch (error) {
    return new Response("Something went wrong!", { status: 500 });
  }
});
