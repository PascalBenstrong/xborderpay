import type { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth/next";
import { NextResponse } from "next/server";
import { login } from "./login/login";
import { register } from "./register/register";
import { User as MyUser } from "@/types"

export const jwt = async ({ token, user, trigger, session }: { token: JWT; user?: any, trigger?: any, session?: any }) => {
    
    if (trigger === "update" && session?.isNewUser === false) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        //token = session;
        token.isNewUser = session.isNewUser;
        token.walletDetails = null;
    }
    if (!user) return token;

    return { ...token, ...user };
};

export const session = ({ session, token, newSession, trigger }: { session: any; token: any, trigger?: any, newSession?: any }): Promise<Session> => {

    // Note, that `rest.session` can be any arbitrary object, remember to validate it!
    if (trigger === "update" && newSession?.isNewUser === false) {
        // Make sure the updated value is reflected on the client
        session.isNewUser = newSession.isNewUser
        session.walletDetails = null;
    }

    // Check if the token has expired
    if (token && token?.exp && Date.now() / 1000 > token.exp) {
        session = null;
        return Promise.resolve(session); // Return null to force the user to log in again
    }

    session.token = token?.jwt;
    session.isNewUser = token?.isNewUser;
    session.walletDetails = token?.walletDetails;

    return Promise.resolve(session);
};

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        //set a maxAge for the session
        maxAge: 6 * 60 * 60, // 24 hours
    },
    secret: process.env.JWT_SECRET,
    providers: [
        CredentialsProvider({
            name: "credentials",
            id: 'credentials',
            credentials: {
                /* authType: { label: "Auth" },
                firstName: {
                    label: "First Name",
                    type: "text",
                    placeholder: "John",
                },
                lastName: {
                    label: "Last Name",
                    type: "text",
                    placeholder: "Doe",
                }, */
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                try {

                    const request = req.body;

                    let result;
                    let isNewUser = false;

                    //console.log("raw: ", req.body)
                    if (request?.authType == "login") {
                        if ((!credentials?.email || !credentials.password)) {
                            throw new Error('email and password are required!');
                        }

                        result = await login(credentials!.email, credentials!.password);
                        //console.log("result: ", result.value)
                    } else if (request?.authType == "register") {
                        if ((!credentials?.email || !credentials.password)) {
                            throw new Error('email and password are required!');
                        }

                        let _user: MyUser = {
                            firstName: request!.firstName,
                            lastName: request!.lastName,
                            email: credentials!.email
                        }

                        result = await register(_user, credentials!.password);
                        isNewUser = true;
                    } else {
                        throw new Error('Invalid request!');
                    }

                    if (!result.isSuccess) {

                        let error: any = !result?.message ? result?.error : result.message;
                        //console.log("error: ", error)

                        throw new Error(error);
                    }

                    // Return the user object and token to be stored in the session
                    // Return the user object without the token
                    const response: any = result.value
                    if (isNewUser) {
                        response.isNewUser = isNewUser;
                    }

                    return response;

                } catch (error: any) {
                    throw new Error(error.message ? error.message : 'Authentication failed');
                }
            },
        }),
    ],
    //cookies: cookies,
    callbacks: {
        session,
        jwt,
    },
};
