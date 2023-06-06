"use client";
import useSWR from "swr";

const fetcher = (url: string) => {

    return fetch(url).then((res) => res.json());
}
export function useFetcher(url: string, token?: string, onSuccess?: (data:any) => void) {

    const { data, error, isLoading } = useSWR(url, fetcher,{onSuccess: (data,key,config)=>{
        onSuccess != null && onSuccess(data?.data);
    }});

    return {
        data,
        isLoading,
        isError: error
    }
}