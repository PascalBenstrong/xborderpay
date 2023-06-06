"use client";
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Unstable_Grid2 as Grid,
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

const walletsJson: Wallet[] = [
  {
    name: "Euros",
    currency: "EUR",
    balance: "115,741.55",
    logo: "",
  },
  {
    name: "US dollar",
    currency: "USD",
    balance: "1,005.00",
    logo: "",
  },
  {
    name: "South African Rand",
    currency: "ZAR",
    balance: "39,134.18",
    logo: "",
  },
];

function GetData() {
  const { data, isError, isLoading } = useFetcher(
    `/api/transactions`
  );

  return {
    transactions: data?.data,
    isLoading,
    isError,
  };
}

export default function HomePage() {
  const [wallets, setwallets] = useState<Wallet[]>(walletsJson);
  /* const [transactions, setTransactions] =
    useState<Transaction[]>(transactionsJson); */
    const { transactions, isError, isLoading } = GetData();
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
              <Paper sx={{ bgcolor: "secondary.main", p: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main" }} aria-label="currency">
                  {item.currency}
                </Avatar>
                <Typography variant="h6" fontWeight={700} mt={2}>
                  {`${item.currency} ${item.balance}`}
                </Typography>
                <Typography variant="body2" my={2}>
                  {item.name}
                </Typography>
                <Button startIcon={<AddCircleIcon />}>Add Funds</Button>
              </Paper>
            </Grid>
          ))}
        {wallets.length < 4 && (
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
        <Grid xs={12} lg={3}>
          <Title title="Rates" />
          <Paper sx={{ bgcolor: "secondary.main", p: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ height: "100%", p: 2 }}
            >
              <AddCircleIcon fontSize="large" />
              <Typography variant="body2" my={2}>
                Add a new currency wallet
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
