import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Unstable_Grid2 as Grid,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { ValidationTextField } from "../entry";
import UserInfoCard from "./userInfoCard";
import AccountCircle from "@mui/icons-material/AccountCircle";
import convertCurrency, { getRate } from "../../utils/currencyConverter";
import { Currency } from "../../types";
import XSelect from "../x_select";

export default function EnterAmount({
  fromAmount,
  setFromAmount,
  toAmount,
  setToAmount,
  fees,
  setFees,
  rate,
  setRate,
  exchangeRates,
}: any) {
  const [convertedAmount, setConvertedAmount] = useState<any>();

  //console.log("exchangeRates: ", exchangeRates);

  const handleFromAmount = async (value: string) => {
    let _amount = parseFloat(value);
    setFromAmount({
      currency: fromAmount.currency,
      amount: value,
    });
    const converted = await convertCurrency(
      _amount,
      fromAmount.currency,
      toAmount.currency,
      exchangeRates
    );
    console.log("converted: ", converted);
    setToAmount({ currency: toAmount.currency, amount: converted });
  };

  const handleFromCurrency = async (value: string) => {
    setFromAmount({
      currency: value,
      amount: fromAmount.amount,
    });
    const converted = await convertCurrency(
      fromAmount.amount,
      value,
      toAmount.currency,
      exchangeRates
    );
    console.log("from currency: ", converted);
    setToAmount({ currency: toAmount.currency, amount: converted });
  };

  const handleToAmount = async (value: any) => {
    setToAmount({
      currency: toAmount.currency,
      amount: value,
    });
    const converted = await convertCurrency(
      value,
      toAmount.currency,
      fromAmount.currency,
      exchangeRates
    );
    console.log("converted: ", converted);
    setFromAmount({ currency: fromAmount.currency, amount: converted });
  };

  const handleToCurrency = async (value: string) => {
    setToAmount({
      currency: value,
      amount: toAmount.amount,
    });
    const converted = await convertCurrency(
      toAmount.amount,
      value,
      fromAmount.currency,
      exchangeRates
    );
    console.log("To currency: ", converted);
    setFromAmount({ currency: fromAmount.currency, amount: converted });
  };

  if (fromAmount.currency != null && fromAmount.currency != null && exchangeRates != null) {
    console.log(
      getRate(fromAmount.currency, toAmount.currency, exchangeRates)
    );
  }

  return (
    <Box width="100%">
      <Typography variant="h6" mb={1}>
        Amount
      </Typography>
      <Stack
        direction="row"
        justifyContent="start"
        alignItems="center"
        spacing={1}
      >
        <XSelect
          value={fromAmount.currency}
          setValue={(value: string) => handleFromCurrency(value)}
          data={Object.values(Currency)}
          removeBorder={true}
          removeMargin={true}
        />
        <ValidationTextField
          id="fromCurrency"
          type="number"
          value={fromAmount.amount}
          onChange={(e) => handleFromAmount(e.target.value)}
          sx={{ p: 0, borderRadius: 0 }}
        />
      </Stack>
      <Box sx={{ borderLeft: "1px solid lightGrey", pl: 2, py: 3, ml: 5 }}>
        <Typography>
          Fees: {fees.currency} {fees.amount} (included)
        </Typography>
        <Typography mt={1}>Rate: {0}</Typography>
      </Box>
      <Stack
        direction="row"
        justifyContent="start"
        alignItems="center"
        spacing={1}
      >
        <XSelect
          value={toAmount.currency}
          setValue={(value: string) => handleToCurrency(value)}
          data={Object.values(Currency)}
          removeBorder={true}
          removeMargin={true}
        />
        <ValidationTextField
          id="fromCurrency"
          type="number"
          value={toAmount.amount}
          onChange={(e) => handleToAmount(e.target.value)}
          sx={{ p: 0, borderRadius: 0 }}
        />
      </Stack>
      <Typography mb={2} mt={4}>
        Estimated Delivery Date: Near Real Time(IMPS)
      </Typography>
    </Box>
  );
}
