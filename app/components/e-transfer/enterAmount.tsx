import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Unstable_Grid2 as Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { ValidationTextField } from "../entry";
import UserInfoCard from "./userInfoCard";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function EnterAmount({
  fromAmount,
  setFromAmount,
  toAmount,
  setToAmount,
  fees,
  setFees,
  rate,
  setRate,
}: any) {
  return (
    <Box width="100%">
      <Typography variant="h6" mb={1}>
        Amount
      </Typography>
      <ValidationTextField
        id="fromCurrency"
        value={fromAmount.amount}
        onChange={(e) =>
          setFromAmount({
            currency: fromAmount.currency,
            amount: e.target.value,
          })
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img
                loading="lazy"
                width="20"
                src={`https://flagcdn.com/w20/us.png`}
                srcSet={`https://flagcdn.com/w40/us.png 2x`}
                alt={fromAmount.currency}
              />{" "}
              <Typography color="lightgrey" px={2}>
                {fromAmount.currency}
              </Typography>
            </InputAdornment>
          ),
        }}
      />
      <Box sx={{ borderLeft: "1px solid lightGrey", pl: 2, py: 3, ml: 5 }}>
        <Typography>
          Fees: {fees.currency} {fees.amount} (included)
        </Typography>
        <Typography mt={1}>Rate: {rate.toFixed(2)}</Typography>
      </Box>
      <ValidationTextField
        id="toCurrency"
        value={toAmount.amount}
        onChange={(e) =>
          setToAmount({ currency: toAmount.currency, amount: e.target.value })
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img
                loading="lazy"
                width="20"
                src={`https://flagcdn.com/w20/za.png`}
                srcSet={`https://flagcdn.com/w40/za.png 2x`}
                alt={toAmount.currency}
              />
              <Typography color="lightgrey" px={2}>
                {toAmount.currency}
              </Typography>
            </InputAdornment>
          ),
        }}
      />
      <Typography mb={2} mt={4}>
        Estimated Delivery Date: Near Real Time(IMPS)
      </Typography>
    </Box>
  );
}
