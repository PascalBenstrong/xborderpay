import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Unstable_Grid2 as Grid,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import UserInfoCard from "./userInfoCard";
import { ValidationTextField } from "../entry";
import { getRate } from "@/utils";

export default function Review({
  userInfo,
  myWalletId,
  payee,
  toWalletId,
  fromAmount,
  setFromAmount,
  toAmount,
  setToAmount,
  fees,
  exchangeRates,
  purpose
}: any) {
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={6}>
        <Typography variant="h6" mb={1}>
          From
        </Typography>
        <UserInfoCard data={userInfo} walletId={myWalletId} />
        <Typography variant="h6" mb={1} mt={2}>
          Amount
        </Typography>
        <Stack direction="row" alignItems="center" sx={{ py: 1 }}>
          {/* <img
            loading="lazy"
            width="30"
            height={15}
            src={`https://flagcdn.com/w20/us.png`}
            srcSet={`https://flagcdn.com/w40/us.png 2x`}
            alt="USD"
          />{" "} */}
         <Typography color="lightgrey" px={1}>
            {fromAmount.currency}
          </Typography>
          <Typography color="white" px={1}>
            {fromAmount.amount}
          </Typography>
        </Stack>
        <Box sx={{ borderLeft: "1px solid lightGrey", pl: 2, py: 3, ml: 5 }}>
          <Typography>Fees: {fees.currency} {fees.amount}</Typography>
          <Typography mt={1}>Rate: {getRate(fromAmount.currency, toAmount.currency, exchangeRates)}</Typography>
        </Box>
        <Stack direction="row" alignItems="center" sx={{ py: 1 }}>
          <Typography color="lightgrey" px={1}>
            {toAmount.currency}
          </Typography>
          <Typography color="white" px={1}>
            {toAmount.amount}
          </Typography>
        </Stack>
        <Typography mb={2} mt={4}>
          Estimated Delivery Date: Near Real Time(IMPS)
        </Typography>
      </Grid>
      <Grid xs={12} md={6}>
        <Typography variant="h6" mb={1}>
          To
        </Typography>
        <UserInfoCard data={payee} walletId={toWalletId} />
        <Typography mb={2} mt={4}>
          Purpose of Transfer:
        </Typography>
        <Typography mb={2} color="lightgrey">
          {purpose}
        </Typography>
        {/* <FormGroup sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox defaultChecked disabled color="primary" />}
            label="Send money on behalf of myself and not on behalf of a third party"
            sx={{ bgcolor: "white" }}
          />
        </FormGroup> */}
      </Grid>
    </Grid>
  );
}
