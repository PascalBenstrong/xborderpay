import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

export type AlertColor = 'success' | 'info' | 'warning' | 'error';

export default function TransitionAlerts({
  open,
  onClose,
  severity,
  message,
}: {
  open: boolean;
  onClose?: () => void;
  severity?: AlertColor;
  message: string
}) {
  return (
    <Collapse in={open}>
      <Alert
      variant="outlined"
        severity={severity ?? "success"}
        /* action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        } */
        sx={{ mb: 2, color: "#7676a7" }}
      >
        <strong>{message}</strong>
      </Alert>
    </Collapse>
  );
}
