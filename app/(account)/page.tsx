"use client";
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Unstable_Grid2 as Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ReceivedIcon from "@mui/icons-material/East";
import Title from "../components/title";
import TransactionCard from "../components/transaction_card";
import { Transaction, Wallet } from "../types";
import { useFetcher } from "../utils";
import CurrencyRates from "../components/rates";
import WalletCard from "../components/wallet_card";

function GetData() {
  const {
    data: wallets,
    isError: isWError,
    isLoading: isWLoading,
  } = useFetcher(`/api/wallets`);

  const { data, isError, isLoading } = useFetcher(`/api/transactions`);

  return {
    transactions: data?.data,
    wallets: wallets?.data,
    isLoading,
    isError,
  };
}

export default function HomePage() {
  const { transactions, wallets, isError, isLoading } = GetData();
  return (
    <Container maxWidth="xl" sx={{ pt: 15, px: 200 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" fontWeight={700}>
          Good morning, Pascal
        </Typography>
        <Button variant="contained" sx={{ borderRadius: 15, px: 5 }}>
          Send Money
        </Button>
      </Stack>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {wallets &&
          wallets.map((item: any, index: number) => (
            <Grid xs={6} lg={3} key={index}>
              <WalletCard name={item.name} balance={item.balance} currency={item.currency}/>
            </Grid>
          ))}
        {wallets?.length < 4 && (
          <Grid xs={6} lg={3}>
            <Paper sx={{ bgcolor: "secondary.main", p: 2, height: "100%" }}>
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{ border: "4px dashed white", height: "100%", p: 2 }}
              >
                <AddCircleIcon fontSize="large" />
                <Typography variant="body2" my={2}>
                  Add a new currency wallet
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        )}
      </Grid>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid xs={12} lg={9}>
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
            {transactions &&
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
              ))}
          </Paper>
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <CurrencyRates />
        </Grid>
      </Grid>
    </Container>
  );
}
