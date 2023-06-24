import React from "react";
import { Stack, Avatar, Box, Typography, Skeleton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SentTransferIcon from "@mui/icons-material/East";
import { TransactionType } from "@/types";
import TopupIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceivedTransferIcon from "@mui/icons-material/West";

type Transaction = {
  type: string;
  to?: string;
  wallet: string;
  currency: string;
  amount: number;
  timestamp: number;
  isLoading?: boolean;
};

const typeHandler = (type: any) => {
  let _type = "Sent to ";

  if (type === TransactionType.Deposit) _type = "Reload ";
  else if (type === TransactionType.WithDrawl) _type = "Withdrawal ";
  else if (type === TransactionType.Transfer) _type = "Sent To ";
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
  isLoading,
}: Transaction) {
  // Convert the timestamp to milliseconds by multiplying it by 1000
  const date = new Date(timestamp);

  // Format the date to "MMM d" format
  const formattedDate = date.toLocaleString("en", {
    month: "short",
    day: "numeric",
  });

  if (isLoading)
    return <Skeleton variant="rectangular" width="100%" height={55} sx={{mb: 1}} />;

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
      sx={{
        borderBottom: "0.1px solid black",
        p: 0.5,
      }}
    >
      <Avatar
        sx={{ bgcolor: "primary.main", width: 30, height: 30 }}
        aria-label="currency"
      >
        {type === TransactionType.Transfer && <SentTransferIcon />}
        {type === TransactionType.Deposit && <TopupIcon />}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="body2"
          fontSize={{ xs: 12, md: 15 }}
          fontWeight={600}
          mb={0}
        >
          {typeHandler(type)}{" "}
          {type !== TransactionType.Deposit &&
            to &&
            `${to.slice(0, 2)}****${to.slice(20, 24)}`}
        </Typography>
        <Typography variant="body2" color="lightGrey" mt={0}>
          {wallet}
        </Typography>
      </Box>
      <Box>
        <Typography align="right" variant="body2" fontWeight={600} mb={0}>
          {`${currency} ${amount}`}
        </Typography>
        <Typography align="right" color="lightGrey" variant="body2" mt={0}>
          {formattedDate}
        </Typography>
      </Box>
      <ChevronRightIcon fontSize="large" />
    </Stack>
  );
}
