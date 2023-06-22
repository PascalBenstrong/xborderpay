import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { BootstrapDialog } from "../dialog";
import { Box, IconButton, Snackbar, Stack, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AlertDialog from "../alertDialog";
import BootstrapInput from "../entry/bootstrapInput";
import { isAnyNull } from "@/utils";
import { Currency } from "@/types";
import { isString30Bytes } from "@/utils/isString30Bytes";
import TransitionAlerts from "../alert";

export default function SecurityFormAlert({
  walletCurrency,
  open,
  onClose,
  onUpdate,
}: {
  open: boolean;
  walletCurrency: Currency;
  onClose: () => void;
  onUpdate: (value: string) => void;
}) {
  const [pkValue, setPxValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault(); // 👈️ prevent page refresh
    if (!isString30Bytes(pkValue)) {
      setErrorMessage("Invalid private key, please verify your key.");
      return;
    }
    setErrorMessage("");
    const _pkValue = pkValue;
    onUpdate(_pkValue);
    setPxValue("");
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <BootstrapDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          align="center"
          sx={{ color: "black" }}
        >
          Authorization Required
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent
            dividers
            sx={{ color: "grey", whiteSpace: "pre-line" }}
          >
            <TransitionAlerts
              severity="error"
              message={errorMessage}
              open={errorMessage.length > 0}
            />
            <DialogContentText
              id="alert-dialog-description"
              align="center"
              mt={2}
              mb={2}
              color="secondary"
            >
              Paste your <strong>{walletCurrency} Wallet</strong> private key to{" "}
              <strong>Authorize</strong> your transfer.
            </DialogContentText>
            <BootstrapInput
              id="fromCurrency"
              name="fromCurrency"
              type="text"
              value={pkValue}
              onChange={(e) => setPxValue(e.target.value)}
              sx={{ color: "black", bgcolor: "transparent" }}
              fullWidth
              multiline
              autoFocus
              required
            />
          </DialogContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ px: 2, py: 1 }}
          >
            <Button color="secondary" onClick={handleClose} size="large">
              Cancel
            </Button>
            <Button variant="contained" type="submit" fullWidth size="large">
              Authorize
            </Button>
          </Stack>
          <DialogActions></DialogActions>
        </form>
      </BootstrapDialog>
    </div>
  );
}
