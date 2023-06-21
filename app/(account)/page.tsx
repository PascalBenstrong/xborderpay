"use client";
import React from "react";
import {
  Button,
  Container,
  Divider,
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
import WalletDetailsDialog from "@/components/walletsSection/walletDetailsDialog";

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

export default function HomePage() {
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
    <Container maxWidth="xl" sx={{pt: {xs: 10,md: 15} }}>
      <Stack direction={{ sm: "row" }} justifyContent="space-between">
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
      <WalletsSection headers={_myHeaders} />
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid xs={12} lg={9}>
          <Title title="Activities" />
          <Paper
            sx={{
              bgcolor: "secondary.main",
              p: 2,
              height: { xs: 430, md: 430, lg: 420 },
              maxHeight: 600,
              borderRadius: 3,
              overflow: "auto",
            }}
          >
            {transactions?.length > 0 ? (
              transactions
                .slice(0, 7)
                .map((item: any, index: number) => (
                  <TransactionCard
                    key={index}
                    to={item.receivingWallet.id}
                    type={item.type}
                    currency={item.receivingWallet.currency}
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
            <Divider />
            <Button
              LinkComponent={Link}
              href="/e-transfer"
              sx={{ width: "100%" }}
            >
              View More Activies
            </Button>
          </Paper>
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <CurrencyRates />
        </Grid>
      </Grid>
    </Container>
  );
}
