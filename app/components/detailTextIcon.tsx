import { Stack, Typography, IconButton } from "@mui/material";
import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function DetailTextIcon({
  label,
  value,
  showCopy
}: {
  label: any;
  value: string;
  showCopy?: boolean
}) {
  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
  };
  return (
    <div>
      <Typography gutterBottom color="lightGrey" lineHeight={1.2}>
        {label}
      </Typography>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        spacing={2}
      >
        <Typography gutterBottom color="lightGrey" fontSize={12}>
          {value}
        </Typography>
        {(value && showCopy) && (
          <IconButton color="primary" onClick={() => copyToClipboard(value)}>
            <ContentCopyIcon />
          </IconButton>
        )}
      </Stack>
    </div>
  );
}
