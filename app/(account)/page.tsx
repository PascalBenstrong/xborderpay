"use client";
import React from "react";
import {
  Button,
  Container,
  Unstable_Grid2 as Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Title from "../components/title";
import TransactionCard from "../components/transaction_card";
import { useFetcher } from "../utils";
import CurrencyRates from "../components/rates";
import WalletCard from "../components/wallet_card";
import EmptyList from "@/components/empty";
import WalletsSection from "@/components/walletsSection";
import Link from "next/link";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function GetData(headers:any) {

  var requestOptions: any = {
    method: "GET",
    headers: headers ?? {},
    redirect: "follow",
  };

  const fetcher = (url: string) =>
    fetch(url, requestOptions).then((res) => res.json());

  const { data, error, isLoading } = useSWRImmutable(
    "/api/transactions",
    fetcher,
    /* { refreshInterval: 60000 } */
  );

  //const { data, isError, isLoading } = useFetcher(`/api/transactions`);

  //console.log("data: ", data);

  return {
    transactions: data?.transactions,
    wallets: [],
    isLoading: true,
    isError: false,
  };
}

export default function HomePage() {
  
  const { data: session }: { data: any } = useSession({
    required: true,
    onUnauthenticated: () => {
      redirect("/login")
    },
  });
  const _myHeaders = {
    authorization:
      `Bearer ${session?.token}`,
  };
  const { transactions, wallets, isError } = GetData(_myHeaders);
  //const { data, error, isLoading } = useSWRImmutable("https://my-json-server.typicode.com/typicode/demo/posts", fetcher, {refreshInterval: 60000,});

  //console.log("data: ", wallets);

  return (
    <Container maxWidth="xl" sx={{ pt: 15, px: 200 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" fontWeight={700}>
          Welcome to the unbank
        </Typography>
        <Button
          LinkComponent={Link}
          href="/e-transfer"
          variant="contained"
          sx={{ borderRadius: 15, px: 5 }}
        >
          Send Money
        </Button>
      </Stack>
        <WalletsSection headers={_myHeaders}/>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid xs={12} lg={9}>
          <Title title="Activities" />
          <Paper
            sx={{
              bgcolor: "secondary.main",
              p: 2,
              pb: 4,
              height: 400,
              maxHeight: 600,
              borderRadius: 3,
              overflow: "auto",
            }}
          >
            {transactions?.length > 0 ? (
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
              ))
            ) : (
              <EmptyList
                title="No Transactions"
                subtitle="Bucket feeling empty? Let's e-transfer now for a transaction thrill! 🛍️💸"
              />
            )}
          </Paper>
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <CurrencyRates />
        </Grid>
      </Grid>
    </Container>
  );
}
