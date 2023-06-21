"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Container,
  Paper,
  Unstable_Grid2 as Grid,
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Title from "../../components/title";
import EnterAmount from "../../components/e-transfer/enterAmount";
import Review from "../../components/e-transfer/review";
import SelectAccountPayee from "../../components/e-transfer/selectPayee";
import ETransferSuccess from "../../components/e-transfer/success";
import UserInfoCard from "../../components/e-transfer/userInfoCard";
import { isAnyNull, useFetcher } from "../../utils";
import { Currency, ETransferRequest, Wallet } from "../../types";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import useSWRImmutable from "swr/immutable";
import TransitionAlerts from "@/components/alert";

const steps = [
  {
    label: "Account & Payee",
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: "Amount",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Preview",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Successful",
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

function GetData(headers: any) {
  var requestOptions: any = {
    method: "GET",
    headers: headers ?? {},
    redirect: "follow",
  };

  const fetcher = (url: string) =>
    fetch(url, requestOptions).then((res) => res.json());

  const { data, error, isLoading } = useSWRImmutable(
    "/api/e-transfer",
    fetcher,
    {
      refreshInterval: 60000,
    }
  );

  return {
    //transactions: data?.data,
    userInfo: data?.user,
    wallets: data?.accounts,
    recentPayees: data?.recentPayees,
    purposes: data?.purposes,
    isLoading,
    isError: error,
  };
}

function GetRates() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWRImmutable("/api/rates", fetcher, {
    refreshInterval: 60000,
  });
  //console.log("MyRates: ", data?.rates)

  return {
    //transactions: data?.data,
    exchangeRates: data?.rates,
  };
}

type Amount = {
  amount: number;
  currency: Currency;
};

function getCurrencyFromWallet(walletId: string, wallets: Wallet[]) {
  const _wallet = wallets?.find((x) => x.id === walletId);

  return _wallet?.currency ?? Currency.USD;
}

export default function ETransferPage() {
  const router = useRouter();

  //get session
  const { data: session }: { data: any } = useSession({
    required: true,
    onUnauthenticated: () => {
      redirect("/login");
    },
  });
  const _myHeaders = {
    authorization: `Bearer ${session?.token}`,
  };
  //get data
  const { userInfo, wallets, recentPayees, purposes, isError, isLoading } =
    GetData(_myHeaders);

  //states
  const { exchangeRates } = GetRates();
  const [activeStep, setActiveStep] = useState(0);
  const [myWalletId, setMyWalletId] = useState("");
  const [payee, setPayee] = useState<any>();
  const [toWalletId, setToWalletId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [reference, setReference] = useState("");
  const [payeeEmail, setPayeeEmail] = useState("");
  const [payeeWallets, setPayeeWallets] = useState<any>();
  const [query, setQuery] = useState("idle");
  const [fromAmount, setFromAmount] = useState<Amount>({
    amount: 0,
    currency: getCurrencyFromWallet(myWalletId, userInfo?.wallets),
  });
  const [toAmount, setToAmount] = useState<Amount>({
    amount: 0,
    currency: getCurrencyFromWallet(toWalletId, payee?.wallets),
  });
  const [fees, setFees] = useState<Amount>({
    amount: 0.07,
    currency: Currency.USD,
  });
  const [rate, setRate] = useState<Number>(19.08);
  const [isValidated, setIsValidated] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const validateFields = (step: number) => {
    if (isAnyNull([myWalletId, payee, purpose]) && activeStep === 0) {
      setErrorMessage("Please fill in all the fields with *");
      return false;
    } else if (
      (isAnyNull([fromAmount]) || fromAmount.amount <= 0) &&
      activeStep === 1
    ) {
      setErrorMessage("Please fill in amount you wish to send");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    clearError();
    if (!validateFields(activeStep)) {
      setIsValidated(false);
      return;
    }

    if (activeStep < 1) {
      setFromAmount({
        amount: fromAmount.amount,
        currency: getCurrencyFromWallet(myWalletId, userInfo?.wallets),
      });
      setToAmount({
        amount: toAmount.amount,
        currency: getCurrencyFromWallet(toWalletId, payee?.wallets),
      });
    }

    //check if we must submit to server
    if (activeStep == 2 && validateFields(activeStep)) {
      /* window.setTimeout(() => {
        setIsFetching(false);
        setActiveStep(3);
      }, 1000); */
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setQuery("idle");
    setFromAmount({
      amount: 0,
      currency: getCurrencyFromWallet(myWalletId, userInfo?.wallets),
    });
    setToAmount({
      amount: 0,
      currency: getCurrencyFromWallet(toWalletId, payee?.wallets),
    });
    setPayeeEmail("");
    setToWalletId("");
    setPurpose("");
    setPayeeWallets(null);
    router.refresh();
  };

  const handleSubmit = () => {
    setIsFetching(true);
    var payload: ETransferRequest = {
      fromWalletId: myWalletId,
      fromPrivateKey: "",
      fromCurrency: fromAmount.currency,
      amount: fromAmount.amount,
      toWalletId: toWalletId,
      toCurrency: toAmount.currency,
      reference: purpose,
    };

    var requestOptions: any = {
      method: "POST",
      headers: _myHeaders,
      body: JSON.stringify(payload),
      redirect: "follow",
    };

    fetch("/api/e-transfer", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        //setActiveStep(3);
        console.log("result: ",result);
        setReference("CAxxx723");
        setIsFetching(false);
      })
      .catch((error) => {
        setIsFetching(false);
        console.log("error: ", error);
      });
  };

  const clearError = () => {
    setIsValidated(true);
    setErrorMessage("");
  };

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 10, md: 15 } }}>
      <Paper
        component="form"
        sx={{
          bgcolor: "secondary.main",
          p: 2,
          px: 4,
          pb: 4,
          borderRadius: 3,
          height: "100%",
        }}
        noValidate={isValidated}
        autoComplete="off"
      >
        <Title title="Send e-Transfer" />
        <Grid container spacing={2}>
          <Grid xs={12} lg={2}>
            <Stepper
              activeStep={activeStep}
              orientation="vertical"
              sx={{ display: { xs: "none", lg: "flex" } }}
            >
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              orientation="horizontal"
              sx={{ display: { xs: "flex", lg: "none" }, mb: 3 }}
            >
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>

          <Grid xs={12} md={12} lg={activeStep > 1 ? 10 : 7}>
            <TransitionAlerts
              severity="error"
              message={errorMessage}
              open={!isValidated}
              onClose={clearError}
            />
            {activeStep === steps.length - 1 && (
              <ETransferSuccess
                fromAmount={fromAmount}
                purpose={purpose}
                reference={reference}
                handleReset={handleReset}
              />
            )}
            {activeStep == 0 && (
              <SelectAccountPayee
                headers={_myHeaders}
                myWalletId={myWalletId}
                setMyWalletId={setMyWalletId}
                wallets={wallets}
                payee={payee}
                setPayee={setPayee}
                recentPayees={recentPayees}
                purpose={purpose}
                setPurpose={setPurpose}
                purposes={purposes}
                toWalletId={toWalletId}
                setToWalletId={setToWalletId}
                payeeEmail={payeeEmail}
                setPayeeEmail={setPayeeEmail}
                payeeWallets={payeeWallets}
                setPayeeWallets={setPayeeWallets}
                query={query}
                setQuery={setQuery}
              />
            )}
            {activeStep == 1 && (
              <EnterAmount
                fromAmount={fromAmount}
                setFromAmount={setFromAmount}
                toAmount={toAmount}
                setToAmount={setToAmount}
                fees={fees}
                setFees={setFees}
                rate={rate}
                setRate={setRate}
                exchangeRates={exchangeRates}
                fromWallets={userInfo?.wallets}
                payeeWallets={payee?.wallets}
              />
            )}
            {activeStep == 2 && (
              <Review
                userInfo={userInfo}
                myWalletId={myWalletId}
                payee={payee}
                toWalletId={toWalletId}
                fromAmount={fromAmount}
                setFromAmount={setFromAmount}
                toAmount={toAmount}
                setToAmount={setToAmount}
                fees={fees}
                exchangeRates={exchangeRates}
                purpose={purpose}
              />
            )}
            {activeStep <= steps.length - 2 && (
              <Box sx={{ mb: 2, mt: 2 }}>
                {activeStep > 0 && (
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1, px: 10 }}
                >
                  {activeStep === steps.length - 2 ? "Send Money" : "NEXT"}
                </Button>
              </Box>
            )}
          </Grid>
          {activeStep < 2 && (
            <Grid
              xs={false}
              sm={12}
              md={12}
              lg={3}
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              <Box>
                <Grid container>
                  <Grid xs={12} sm={6} lg={12}>
                    <Typography variant="h6" mb={1}>
                      From
                    </Typography>
                    {userInfo && (
                      <UserInfoCard data={userInfo} walletId={myWalletId} />
                    )}
                  </Grid>
                  <Grid xs={12} sm={6} lg={12}>
                    <Typography
                      variant="h6"
                      mt={{ xs: 3, md: 0, lg: 3 }}
                      mb={1}
                    >
                      To
                    </Typography>
                    {payee && (
                      <UserInfoCard data={payee} walletId={toWalletId} />
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetching}
        //onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}
