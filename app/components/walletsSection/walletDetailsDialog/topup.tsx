import BootstrapInput from "@/components/entry/bootstrapInput";
import XSelect from "@/components/x_select";
import { Currency, Wallet } from "@/types";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";

export default function AccountTopup({
  wallet,
  updateChange,
}: {
  wallet: Wallet;
  updateChange: (value: Wallet) => void;
}) {
  const [selectedCurrency, setCurrecy] = useState<Currency>(wallet.currency);
  const [amount, setAmount] = useState(0);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAmount(Number(value));
  };

  const handleSubmit = () => {
    if (amount > 0) {
      wallet.balance += amount;
      updateChange(wallet);
    }
  };

  return (
    <Box sx={{ bgcolor: "transparent", p: 2, width: { xs: 320, md: 400 } }}>
      <Typography fontWeight="bold" fontSize={24} mt={2} mb={4}>
        How much you want to add?
      </Typography>
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
          sx={{ color: "black", bgcolor: "transparent" }}
          autoFocus
          required
        />
        <Typography sx={{ color: "lightGrey", fontSize: 10, mt: 1 }}>
          You have {wallet.balance} {wallet.currency} in your balance.
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
    </Box>
  );
}
