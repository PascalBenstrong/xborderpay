import { Typography } from "@mui/material";
import React from "react";

export default function Title({ title }: any) {
  return (
    <Typography variant="h6" fontWeight={700} mb={2}>
      {title}
    </Typography>
  );
}
