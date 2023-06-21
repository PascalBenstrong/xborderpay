"use client";
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
} from "@mui/material";
import React, { useState } from "react";
import TransactionCard from "../../components/transaction_card";
import Title from "../../components/title";
import VerticalLinearStepper from "../../components/stepper";
import EnterAmount from "../../components/e-transfer/enterAmount";
import Review from "../../components/e-transfer/review";
import SelectAccountPayee from "../../components/e-transfer/selectPayee";
import ETransferSuccess from "../../components/e-transfer/success";
import UserInfoCard from "../../components/e-transfer/userInfoCard";
import { isAnyNull, useFetcher } from "../../utils";
import { Currency } from "../../types";
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

  //console.log("data: ", data);

  return {
    //transactions: data?.data,
    wallets: data?.accounts,
    recentPayees: data?.recentPayees,
    purposes: data?.purposes,
    isLoading,
    isError: error,
  };
}

function GetRates() {
  const { data, isError, isLoading } = useFetcher(`/api/rates`);
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

export default function ETransferPage() {
  const { data: session }: { data: any } = useSession({
    required: true,
    onUnauthenticated: () => {
      redirect("/login");
    },
  });
  const _myHeaders = {
    authorization: `Bearer ${session?.token}`,
  };
  const { wallets, recentPayees, purposes, isError, isLoading } =
    GetData(_myHeaders);
  const { exchangeRates } = GetRates();
  const [activeStep, setActiveStep] = useState(0);
  const [account, setAccount] = useState("");
  const [payee, setPayee] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [fromAmount, setFromAmount] = useState<Amount>({
    amount: 0,
    currency: Currency.USD,
  });
  const [toAmount, setToAmount] = useState<Amount>({
    amount: 0,
    currency: Currency.ZAR,
  });
  const [fees, setFees] = useState<Amount>({
    amount: 0.05,
    currency: Currency.USD,
  });
  const [rate, setRate] = useState<Number>(19.08);
  const [isValidated, setIsValidated] = useState(true);

  const validateFields = () => {
    if (isAnyNull([account, payee, purpose, fromAmount])) return false;

    return true;
  };

  const handleNext = () => {
    if (!validateFields() && activeStep === 0) {
      setIsValidated(false);
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = () => {};

  const clearError = () => {
    setIsValidated(true)
  }

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
            <TransitionAlerts severity="error"  message="Please fill in all the fields with *" open={!isValidated} onClose={clearError}/>
            {activeStep === steps.length - 1 && (
              <ETransferSuccess handleReset={handleReset} />
            )}
            {activeStep == 0 && (
              <SelectAccountPayee
                headers={_myHeaders}
                account={account}
                setAccount={setAccount}
                wallets={wallets}
                payee={payee}
                setPayee={setPayee}
                recentPayees={recentPayees}
                purpose={purpose}
                setPurpose={setPurpose}
                purposes={purposes}
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
              />
            )}
            {activeStep == 2 && <Review />}
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
                    <UserInfoCard />
                  </Grid>
                  <Grid xs={12} sm={6} lg={12}>
                    <Typography
                      variant="h6"
                      mt={{ xs: 3, md: 0, lg: 3 }}
                      mb={1}
                    >
                      To
                    </Typography>
                    {payee && <UserInfoCard data={payee} />}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
}
