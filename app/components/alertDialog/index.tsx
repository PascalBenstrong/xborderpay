import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { BootstrapDialog } from "../dialog";

export default function AlertDialog({
  title,
  description,
  open,
  onClose,
  okText,
  onOk,
}: any) {
  return (
    <div>
      <BootstrapDialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: "black" }}>
          {title}
        </DialogTitle>
        <DialogContent dividers sx={{ color: "grey", whiteSpace: "pre-line" }}>
          <DialogContentText id="alert-dialog-description" color="secondary">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">{onOk ? "Cancel" : "OK"}</Button>
          {onOk && <Button onClick={onOk}>{okText ? okText : "OK"}</Button>}
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
