"use client";
import React, { useEffect } from "react";
import {
  Button,
  Container,
  Divider,
  Unstable_Grid2 as Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Title from "../components/title";
import TransactionCard from "../components/transaction_card";
import CurrencyRates from "../components/rates";
import EmptyList from "@/components/empty";
import WalletsSection from "@/components/walletsSection";
import Link from "next/link";
import useSWRImmutable from "swr/immutable";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import SecurityAlert from "@/components/securityAlert";

function GetData(headers: any) {
  var requestOptions: any = {
    method: "GET",
    headers: headers ?? {},
    redirect: "follow",
  };

  const fetcher = (url: string) =>
    fetch(url, requestOptions).then((res) => res.json());

  const { data, error, isLoading, mutate } = useSWRImmutable(
    "/api/transactions",
    fetcher,
    { refreshInterval: 1000, revalidateOnFocus: true }
  );

  return {
    transactions: data?.transactions,
    isLoading,
    isError: error,
    mutate,
  };
}

export default function HomePage() {
  const { data: session, update }: any = useSession({
    required: true,
    onUnauthenticated: () => {
      redirect("/login");
    },
  });
  const [securityAlert, setSecurityAlert] = React.useState(false);
  const [valueToCopy, setValueToCopy] = React.useState("");
  const _myHeaders = {
    authorization: `Bearer ${session?.token}`,
  };
  const { transactions, isError, isLoading, mutate } = GetData(_myHeaders);

  //mutate(transactions);

  useEffect(() => {
    if (session?.walletDetails !== null && session?.isNewUser) {
      //setPkValue(data.privateKey);
      setValueToCopy(session?.walletDetails?.privateKey);
      setSecurityAlert(true);

      // Save the updated session object
      // The changes will persist to the next session
      // Replace 'session' with the actual name of your session object
      // Save the updated session
      update({ isNewUser: false });
    }
  }, [session, update, setValueToCopy, setSecurityAlert]);

  const handleSecurityAlertClose = () => {
    setSecurityAlert(false);
  };

  return (
    <Container maxWidth="xl" sx={{ pt: { xs: 10, md: 15 }, minHeight: "70vh" }}>
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
              height: { xs: 430, md: 480, lg: 430 },
              maxHeight: 600,
              borderRadius: 3,
              overflow: "auto",
            }}
          >
            {Array.from(transactions?.slice(0, 7) ?? new Array(6)).map(
              (item: any, index: number) => (
                <TransactionCard
                  key={index}
                  to={item?.receivingWallet?.id}
                  type={item?.type}
                  currency={item?.senderWallet?.currency}
                  amount={item?.amount}
                  wallet={item?.receivingWallet?.name}
                  timestamp={item?.timestamp}
                  isLoading={isLoading}
                />
              )
            )}

            {!transactions && !isLoading && (
              <EmptyList
                title="No Transactions"
                subtitle="Bucket feeling empty? Let's e-transfer now for a transaction thrill! 🛍️💸"
              />
            )}
            <Divider />
            {transactions?.length > 7 && (
              <Button
                LinkComponent={Link}
                href="/e-transfer"
                sx={{ width: "100%" }}
              >
                View More Activies
              </Button>
            )}
          </Paper>
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <CurrencyRates />
        </Grid>
      </Grid>
      {valueToCopy && (
        <SecurityAlert
          valueToCopy={valueToCopy}
          open={securityAlert}
          onClose={handleSecurityAlertClose}
        />
      )}
    </Container>
  );
}
