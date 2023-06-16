import jwt from "jsonwebtoken"
import {wrapInTryCatchVoid, wrapInTryCatch} from "@/utils/errorHandling"


const auth = wrapInTryCatch<boolean,Request>(async (request) => 
{
    request.headers.
});
export default function a(func: (request: Request) => Promise<Response>): (request: Request) => Promise<Response> {
    return async(request: Request) =>
    {
        return await func(request)
    }
}