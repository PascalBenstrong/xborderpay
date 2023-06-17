"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (url: string) => {
    const requestOptions: any = {
        method: 'Get',
        headers: authHeader(),
    };

    return fetch(url,requestOptions).then((res) => res.json());
}

export function authHeader() {

    const { data: session }: {data:any} = useSession();
    
    if (session && session.token) {
        return { Authorization: `Bearer ${session.token}` };
    } else {
        return {};
    }
}

export function useFetcher(url: string, dataKey?: string, token?: string, onSuccess?: (data: any) => void) {

    const { data, error, isLoading } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
        revalidateOnMount: false,
        revalidateOnReconnect: true,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        refreshInterval: 0, onSuccess: (data, key, config) => {
            onSuccess != null && onSuccess(data?.data);
        }
    });

    return {
        data,
        isLoading,
        isError: error
    }
}