import type { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth/next";

export const jwt = async ({ token, user }: { token: JWT; user?: any }) => {

    if (!user) return token;

    return { ...token, ...user };
};

export const session = ({ session, token }: { session: any; token: any }): Promise<Session> => {
    session.token = token?.accessToken.token;

    return Promise.resolve(session);
};

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            id: 'credentials',
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials.password) {
                        throw new Error('email and password are required!');
                    }

                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    var raw = JSON.stringify(credentials);

                    var requestOptions: any = {
                        method: 'POST',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                    };

                    const response = await fetch("http://127.0.0.1:5220/api/auth/login", requestOptions)
                        .then(response => response.json())
                        .then(result => result?.data)
                        .catch(error => {
                            //console.log('error', error);
                            throw new Error(error.error);
                        });

                    if (response?.accessToken) {
                        // Return the user object and token to be stored in the session
                        // Return the user object without the token

                        const token = {
                            refreshToken: response.refreshToken,
                            accessToken: response.accessToken,
                        }
                        const user = {
                            email: credentials.email,
                            ...token
                        };

                        console.log("Data: ", response)
                        return response;
                    }

                    
                } catch (error: any) {
                    throw new Error(error?.message ? error.message : 'Authentication failed');
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

