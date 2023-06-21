import {
  Box,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import convertCurrency, { getRate } from "../../utils/currencyConverter";
import { Currency } from "../../types";
import XSelect from "../x_select";
import BootstrapInput from "../entry/bootstrapInput";
import { parseNumber } from "@/utils/parseNumber";

export default function EnterAmount({
  fromAmount,
  setFromAmount,
  toAmount,
  setToAmount,
  fees,
  rate,
  exchangeRates,
}: any) {
  const handleFromAmount = async (value: string) => {
    let _amount = parseNumber(value);
    //console.log("from _amount: ", _amount, " \n value: ",value);
    setFromAmount({
      currency: fromAmount.currency,
      amount: _amount,
    });
    const converted = await convertCurrency(
      _amount,
      fromAmount.currency,
      toAmount.currency,
      exchangeRates
    );
    //console.log("from amount: ", converted);
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
    //console.log("from currency: ", converted);
    setToAmount({ currency: toAmount.currency, amount: converted });
  };

  const handleToAmount = async (value: any) => {
    let _amount = parseNumber(value);
    setToAmount({
      currency: toAmount.currency,
      amount: _amount,
    });
    const converted = await convertCurrency(
      _amount,
      toAmount.currency,
      fromAmount.currency,
      exchangeRates
    );
    //console.log("converted: ", converted);
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
    setFromAmount({ currency: fromAmount.currency, amount: converted });
  };

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
          disabled
        />
        <BootstrapInput
          id="fromCurrency"
          name="fromCurrency"
          type="text"
          value={fromAmount.amount}
          onChange={(e) => handleFromAmount(e.target.value)}
          sx={{ color: "white", bgcolor: "transparent" }}
          autoFocus
          required
        />
      </Stack>
      <Box sx={{ borderLeft: "1px solid lightGrey", pl: 2, py: 3, ml: 5 }}>
        <Typography>
          Fees: {fees.currency} {fees.amount} (included)
        </Typography>
        <Typography mt={1}>Rate: {getRate(fromAmount.currency, toAmount.currency, exchangeRates)}</Typography>
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
          disabled
        />
        <BootstrapInput
          id="toCurrency"
          name="toCurrency"
          type="text"
          value={toAmount.amount}
          onChange={(e) => handleToAmount(e.target.value)}
          sx={{ color: "white", bgcolor: "transparent" }}
          required
        />
      </Stack>
      <Typography mb={2} mt={4}>
        Estimated Delivery Date: Near Real Time(IMPS)
      </Typography>
    </Box>
  );
}
