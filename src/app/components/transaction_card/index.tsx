import React from "react";
import { Stack, Avatar, Box, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ReceivedIcon from "@mui/icons-material/East";

type Transaction = {
    type: string,
    to: string,
    wallet: string,
    currency: string,
    amount: number,
    timestamp: number
}
export default function TransactionCard() {
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
      sx={{
        borderBottom: "0.1px solid white",
        p: 2,
      }}
    >
      <Avatar sx={{ bgcolor: "primary.main" }} aria-label="currency">
        <ReceivedIcon fontSize="medium" />
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" fontWeight={600} mb={2}>
          Sent to Jane Doe
        </Typography>
        <Typography variant="body2" mt={2}>
          ZAR Wallet
        </Typography>
      </Box>
      <Box>
        <Typography align="right" variant="body2" fontWeight={600} mb={2}>
          ZAR 30,000.00
        </Typography>
        <Typography align="right" variant="body2" mt={2}>
          Jun 6
        </Typography>
      </Box>
      <ChevronRightIcon fontSize="large" />
    </Stack>
  );
}
