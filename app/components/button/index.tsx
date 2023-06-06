import { Button } from "@mui/material";
import React from "react";

export default function XButton({ text }: any) {
  return (
    <Button variant="contained" sx={{ borderRadius: 15, px: 5 }}>
      {text}
    </Button>
  );
}
