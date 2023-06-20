import XIconButton from "@/components/button/iconButton";
import DetailTextIcon from "@/components/detailTextIcon";
import { Wallet } from "@/types";
import { Avatar, Box, Button, Paper, Stack, Typography } from "@mui/material";
import React from "react";

export default function AccountDetails({ accountHolder,wallet }: {accountHolder: string, wallet: Wallet }) {
  
  return (
    <div>
      <Paper sx={{ bgcolor: "secondary.main", p: 2, width: {xs: 320,md: 400} }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={4}>
          <Avatar sx={{ bgcolor: "primary.main" }} aria-label="currency">
            {wallet?.currency}
          </Avatar>

          <Typography fontWeight="bold" mt={2}>
            Your {wallet?.currency} wallet details
          </Typography>
        </Stack>
        <DetailTextIcon label="Account Holder" value={accountHolder} showCopy={true}/>
        <DetailTextIcon label="Account Number" value={wallet?.account.id} showCopy={true} />
        <DetailTextIcon label="Wallet Name" value={wallet?.currency} />
        <DetailTextIcon label="Wallet Currency" value={wallet?.currency} />
      </Paper>
    </div>
  );
}
