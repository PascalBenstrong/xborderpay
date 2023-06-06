import React from "react";
import { Box, Unstable_Grid2 as Grid, Typography } from "@mui/material";
import UserInfoCard from "./userInfoCard";

export default function Review() {
  return (
    <Grid container spacing={2}>
      <Grid xs={12} md={6}>
        <Typography variant="h6" mb={1}>
          From
        </Typography>
        <UserInfoCard />
      </Grid>
      <Grid xs={12} md={6}>
        <Typography variant="h6" mb={1}>
          To
        </Typography>
        <UserInfoCard />
      </Grid>
    </Grid>
  );
}
