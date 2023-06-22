import TransitionAlerts from "@/components/alert";
import BootstrapInput from "@/components/entry/bootstrapInput";
import XSelect from "@/components/x_select";
import { Currency, Wallet, WalletTopupRequest } from "@/types";
import convertCurrency from "@/utils/currencyConverter";
import { parseNumber } from "@/utils/parseNumber";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import useSWRImmutable from "swr/immutable";

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

export default function AccountTopup({
  wallet,
  updateChange,
  headers,
}: {
  wallet: Wallet;
  updateChange: (value: Wallet) => void;
  headers: Headers;
}) {
  const { exchangeRates } = GetRates();
  const [selectedCurrency, setCurrecy] = useState<Currency>(wallet.currency);
  const [amount, setAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const _amount = parseNumber(value);
    setAmount(_amount);
  };

  const handleSubmit = async () => {
    if (amount > 0) {
      try {
        setIsProcessing(true);
        var payload: WalletTopupRequest = {
          toWalletId: wallet.id,
          fromCurrency: selectedCurrency,
          amount: amount,
        };

        var requestOptions: any = {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
          redirect: "follow",
        };

        const response = await fetch("/api/wallets/topup", requestOptions);

        if (response.ok) {
          console.log("sucess");
          if (wallet.currency === selectedCurrency) wallet.balance += amount;
          else {
            const converted = await convertCurrency(
              amount,
              selectedCurrency,
              wallet.currency,
              exchangeRates
            );

            wallet.balance += converted;
          }
          setIsProcessing(false);
          updateChange(wallet);
        } else {
          const error = await response.text();
          console.log("error:", error);
          setErrorMessage(error);
          setIsProcessing(false);
        }
      } catch (ex) {
        console.log("error", ex);
        setErrorMessage("Something went wrong try again later!");
        setIsProcessing(false);
      }
    } else {
      setErrorMessage("Please enter a minimum of 1 to 100.");
    }
  };

  return (
    <Box sx={{ bgcolor: "transparent", p: 2, width: { xs: 320, md: 400 } }}>
      <Typography fontWeight="bold" fontSize={24} mt={2} mb={4}>
        How much you want to add?
      </Typography>
      <TransitionAlerts
        severity="error"
        message={errorMessage}
        open={errorMessage.length > 0}
      />
      <FormControl variant="standard" fullWidth>
        <InputLabel sx={{ color: "lightGrey" }} htmlFor="email">
          {`Add (in ${wallet.currency})`}
        </InputLabel>
        <BootstrapInput
          placeholder="Please enter your email address"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={amount}
          onChange={handleChange}
          sx={{ color: "black",
          "& .MuiInputBase-input": {
            backgroundColor: "white",
          }, }}
          autoFocus
          required
        />
        <Typography sx={{ color: "lightGrey", fontSize: 10, mt: 1 }}>
          You have {wallet.balance.toFixed(2)} {wallet.currency} in your balance.
        </Typography>
      </FormControl>
      <FormControl variant="standard" fullWidth sx={{ mt: 3 }}>
        <Typography sx={{ color: "lightGrey", fontSize: 12, mb: 2 }}>
          Paying with
        </Typography>

        <XSelect
          value={selectedCurrency}
          setValue={(value: string) => setCurrecy(value as Currency)}
          data={Object.values(Currency)}
          removeMargin={true}
          fullWidth
          disabled={true}
        />
      </FormControl>
      <Button
        variant="contained"
        sx={{ borderRadius: 15, px: 5, mt: 4, float: "right" }}
        onClick={handleSubmit}
      >
        Continue
      </Button>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isProcessing}
        //onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
