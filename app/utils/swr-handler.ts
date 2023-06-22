"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import useSWRImmutable from "swr/immutable"

export const fetcher = (url: string) => {
    const requestOptions: any = {
        method: 'Get',
        headers: AuthHeader(),
    };

    return fetch(url, requestOptions).then((res) => res.json());
}

export function AuthHeader() {

    const { data: session }: { data: any } = useSession();

    if (session && session.token) {
        return { Authorization: `Bearer ${session.token}` };
    } else {
        return {};
    }
}

export function useFetcher(url: string, dataKey?: string, onSuccess?: (data: any) => void) {

    //const { data, error, isLoading } = useSWR(url, fetcher);
    const { data, error, isLoading } = useSWRImmutable(url, fetcher, {
        onSuccess: (data, key, config) => {
            onSuccess != null && onSuccess(data);
        }
    });

    //console.log("SWRData: ", data)

    return {
        data,
        isLoading,
        isError: error
    }
}