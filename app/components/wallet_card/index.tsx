import React from "react";
import {
  Paper,
  Avatar,
  Typography,
  Button,
  CardActionArea,
  Box,
  Skeleton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Currency } from "@/types";

export default function WalletCard({
  name,
  currency,
  balance,
  handlePreview,
  isLoading,
}: {
  name: string,
  currency: Currency,
  balance: number,
  handlePreview: ()=>void,
  isLoading?: boolean,
}) {

  if (isLoading)
    return (
      <Paper sx={{ bgcolor: "secondary.main", p: 2 }}>
        <Skeleton animation="wave" variant="circular" width={40} height={40} />
        <Skeleton animation="wave" height={30} width="80%" sx={{ mt: 2 }} />
        <Skeleton animation="wave" height={25} width="40%" sx={{ mt: 2 }} />
      </Paper>
    );

  return (
    <CardActionArea>
      <Paper sx={{ bgcolor: "secondary.main", p: 2 }} onClick={handlePreview}>
        {isLoading ? (
          <Skeleton
            animation="wave"
            variant="circular"
            width={40}
            height={40}
          />
        ) : (
          <Avatar sx={{ bgcolor: "primary.main" }} aria-label="currency">
            {currency}
          </Avatar>
        )}

        <Typography variant="h6" fontWeight={700} mt={2}>
          <Box component="span" sx={{ fontSize: 12 }}>
            {currency}
          </Box>{" "}
          {balance.toFixed(2)}
        </Typography>
        <Typography variant="body2" my={2}>
          {name}
        </Typography>
      </Paper>
    </CardActionArea>
  );
}
