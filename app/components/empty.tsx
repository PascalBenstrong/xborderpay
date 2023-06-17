import React from "react";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";

export default function EmptyList(props: any) {
  const { title, subtitle,action } = props;
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={4}
      sx={{ mt: 4 }}
    >
      <Typography
        component="h2"
        variant="h5"
        textAlign="center"
        sx={{ fontSize: 30, fontWeight: 600, mt: 4 }}
      >
        {title && title}
      </Typography>
      <Typography
        component="p"
        variant="body1"
        textAlign="center"
        sx={{ fontSize: 18, mt: 4 }}
      >
        {subtitle && subtitle}
      </Typography>
      <Image src="/no_items.png" alt="No Iteams" width={60} height={60} color="red" />
      <Typography
        component="p"
        variant="body1"
        textAlign="center"
        sx={{ fontSize: 18, mt: 4 }}
      >
        {action && action}
      </Typography>
    </Stack>
  );
}
