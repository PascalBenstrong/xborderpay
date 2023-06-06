import React from "react";
import { Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function Verificationcheck({ isSuccess, name }: any) {
  return (
    <Stack direction="row" alignItems="center" my={3} spacing={1}>
      {isSuccess ? (
        <CheckCircleIcon color="primary" fontSize="small" />
      ) : (
        <CheckCircleOutlineIcon color="disabled" fontSize="small" />
      )}

      <Typography color={isSuccess ? "primary" : ""}>{name}</Typography>
    </Stack>
  );
}
