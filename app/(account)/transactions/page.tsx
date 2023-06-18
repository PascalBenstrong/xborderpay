"use client";
import { Container, Paper } from "@mui/material";
import React from "react";
import { useFetcher } from "../../utils";
import TransactionCard from "../../components/transaction_card";
import Title from "../../components/title";
import EmptyList from "@/components/empty";

function GetData() {
  const { data, isError, isLoading } = useFetcher(`/api/transactions`);

  return {
    transactions: data?.data,
    isLoading,
    isError,
  };
}

export default function TransactionsPage() {
  const { transactions, isError, isLoading } = GetData();

  return (
    <Container maxWidth="lg" sx={{ pt: 15, px: 200 }}>
      <Title title="Activities" />
      <Paper
        sx={{
          bgcolor: "secondary.main",
          p: 2,
          pb: 4,
          maxHeight: 600,
          borderRadius: 3,
          overflow: "auto",
        }}
      >
        {transactions ?
          transactions.map((item: any, index: number) => (
            <TransactionCard
              key={index}
              to={item.to}
              type={item.type}
              currency={item.currency}
              amount={item.amount}
              wallet={item.wallet}
              timestamp={item.timestamp}
            />
          )) : <EmptyList title="No Transactions" subtitle="Bucket feeling empty? Let's e-transfer now for a transaction thrill! 🛍️💸"/>}
      </Paper>
    </Container>
  );
}
