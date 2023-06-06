import { Paper, Stack, IconButton, Typography, Avatar } from "@mui/material";
import React from "react";
import Title from "../title";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function CurrencyRates() {
  return (
    <div>
      <Title title="Rates" />
      <Paper sx={{ bgcolor: "secondary.main", p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ height: "100%", p: 2 }}
        >
          <IconButton color="primary" aria-label="next">
            <ChevronLeftIcon fontSize="large" />
          </IconButton>

          <Typography variant="body2" fontWeight={700} my={2}>
            USD 1
          </Typography>
          <Typography variant="h5" fontWeight={700} my={2}>
            =
          </Typography>
          <Typography variant="body2" fontWeight={700} my={2}>
            19.26 ZAR
          </Typography>
          <Avatar sx={{ bgcolor: "primary.main" }} aria-label="currency">
            ZAR
          </Avatar>
        </Stack>
      </Paper>
    </div>
  );
}
