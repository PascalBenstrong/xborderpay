"use client";
import { Container, Paper } from "@mui/material";
import React from "react";
import { useFetcher } from "../../utils";
import TransactionCard from "../../components/transaction_card";
import Title from "../../components/title";
import EmptyList from "@/components/empty";
import useSWRImmutable from "swr/immutable";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

function GetData(headers: any) {
  var requestOptions: any = {
    method: "GET",
    headers: headers ?? {},
    redirect: "follow",
  };

  const fetcher = (url: string) =>
    fetch(url, requestOptions).then((res) => res.json());

  const { data, error, isLoading } = useSWRImmutable(
    "/api/transactions",
    fetcher
    /* { refreshInterval: 60000 } */
  );

  return {
    transactions: data?.transactions,
    isLoading,
    isError: error,
  };
}

export default function TransactionsPage() {
  const { data: session }: { data: any } = useSession({
    required: true,
    onUnauthenticated: () => {
      redirect("/login");
    },
  });
  const _myHeaders = {
    authorization: `Bearer ${session?.token}`,
  };
  const { transactions, isError, isLoading } = GetData(_myHeaders);

  return (
    <Container maxWidth="lg" sx={{ pt: {xs: 10,md: 15}}}>
      <Title title="Activities" />
      <Paper
        sx={{
          bgcolor: "secondary.main",
          p: 2,
          pb: 4,
          height: "80vh",
          borderRadius: 3,
          overflow: "auto",
        }}
      >
        {transactions ? (
          transactions.map((item: any, index: number) => (
            <TransactionCard
              key={index}
              to={item.receivingWallet.id}
              type={item.type}
              currency={item.senderWallet.currency}
              amount={item.amount}
              wallet={item.receivingWallet.name}
              timestamp={item.timestamp}
            />
          ))
        ) : (
          <EmptyList
            title="No Transactions"
            subtitle="Bucket feeling empty? Let's e-transfer now for a transaction thrill! 🛍️💸"
          />
        )}
      </Paper>
    </Container>
  );
}
