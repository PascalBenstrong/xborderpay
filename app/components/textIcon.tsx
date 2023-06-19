import { Stack, Typography } from "@mui/material";
import React from "react";

export default function TextIcon({ Icon, text }: { Icon: any; text: string }) {
  return (
    <Stack direction="row" py={2} spacing={2}>
      <Icon />
      <Typography gutterBottom color="lightGrey" lineHeight={1.2}>
        {text}
      </Typography>
    </Stack>
  );
}
