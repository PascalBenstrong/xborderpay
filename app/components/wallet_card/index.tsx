import React from "react";
import { Paper, Avatar, Typography, Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function WalletCard({ name, currency, balance }: any) {
  return (
    <Paper sx={{ bgcolor: "secondary.main", p: 2 }}>
      <Avatar sx={{ bgcolor: "primary.main" }} aria-label="currency" >
        {currency}
      </Avatar>
      <Typography variant="h6" fontWeight={700} mt={2}>
        {`${currency} ${balance}`}
      </Typography>
      <Typography variant="body2" my={2}>
        {name}
      </Typography>
      <Button startIcon={<AddCircleIcon />}>Add Funds</Button>
    </Paper>
  );
}
