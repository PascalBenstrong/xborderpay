import React from "react";
import {
  Paper,
  Avatar,
  Typography,
  Button,
  CardActionArea,
  Box,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function WalletCard({
  name,
  currency,
  balance,
  handlePreview,
}: any) {
  return (
    <CardActionArea>
      <Paper sx={{ bgcolor: "secondary.main", p: 2 }} onClick={handlePreview}>
        <Avatar sx={{ bgcolor: "primary.main" }} aria-label="currency">
          {currency}
        </Avatar>
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
