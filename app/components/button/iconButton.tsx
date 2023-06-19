import { IconButton, Stack, Typography, Button, Box } from "@mui/material";
import React from "react";

export default function XIconButton({
  Icon,
  text,
  color,
  onClick
}: {
  Icon: any;
  text: string;
  color?: string;
  onClick?: () => void 
}) {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
      <IconButton
        aria-label={text}
        sx={{
          bgcolor: color ? color : "lightGrey",
          color: "white",
          width: 40,
          height: 40,
        }}
        onClick={onClick}
      >
        {Icon}
      </IconButton>
      <Typography
        gutterBottom
        color={color ? color : "lightGrey"}
        fontSize={12}
        lineHeight={1}
      >
        {text}
      </Typography>
    </Stack>
  );
}
