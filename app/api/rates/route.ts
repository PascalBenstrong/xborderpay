import { NextResponse } from "next/server";
import { User, Wallet } from "../../types";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    var requestOptions: any = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = fetch(`https://openexchangerates.org/api/latest.json?app_id=9a2e487fc0f04386b607eda70dd703cc&base=USD`, requestOptions)

    let data = await response.then(result => result.json());
    //console.log("Data: ", data);
    return NextResponse.json(data);

}