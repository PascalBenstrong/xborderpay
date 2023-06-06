import React from "react";
import { Stack, Avatar, Box, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ReceivedIcon from "@mui/icons-material/East";

type Transaction = {
  type: string;
  to?: string;
  wallet: string;
  currency: string;
  amount: number;
  timestamp: number;
};

const typeHandler = (type: any) => {
  let _type = "Sent to ";

  if (type === "deposit") _type = "Reload ";
  else if (type === "withdrawal") _type = "Withdrawal ";
  else if (type === "transfer") _type = "Sent To ";
  else if (type === "received") _type = "Received from ";

  return _type;
};

export default function TransactionCard({
  type,
  to,
  wallet,
  currency,
  amount,
  timestamp,
}: Transaction) {
  // Convert the timestamp to milliseconds by multiplying it by 1000
  const date = new Date(timestamp * 1000);

  // Format the date to "MMM d" format
  const formattedDate = date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
      sx={{
        borderBottom: "0.1px solid black",
        p: 2,
      }}
    >
      <Avatar sx={{ bgcolor: "primary.main" }} aria-label="currency">
        <ReceivedIcon fontSize="medium" />
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" fontWeight={600} mb={2}>
          {typeHandler(type)} {to && to}
        </Typography>
        <Typography variant="body2" mt={2}>
          {wallet}
        </Typography>
      </Box>
      <Box>
        <Typography align="right" variant="body2" fontWeight={600} mb={2}>
          {`${currency} ${amount}`}
        </Typography>
        <Typography align="right" variant="body2" mt={2}>
          {formattedDate}
        </Typography>
      </Box>
      <ChevronRightIcon fontSize="large" />
    </Stack>
  );
}
