"use client";
import useSWR from "swr";

const fetcher = (url: string) => {

    return fetch(url).then((res) => res.json());
}
export function useFetcher(url: string, dataKey?: string, token?: string, onSuccess?: (data: any) => void) {
    /* const revalidationOptions = {
        revalidateOnMount: !Cache.has(dataKey), //here we refer to the SWR cache
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }; */

    const { data, error, isLoading } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
        revalidateOnMount: true,
        revalidateOnReconnect: false,
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