import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { BootstrapDialog } from "../dialog";
import { Box, IconButton, Snackbar, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AlertDialog from "../alertDialog";

export default function SecurityAlert({
  valueToCopy,
  open,
  onClose,
}: {
  valueToCopy: string;
  open: boolean;
  onClose: () => void;
}) {
  const [openSnack, setOpenSnack] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [isError, setIsError] = React.useState({
    title: "Warning",
    description:
      "Are you sure you have copied your wallet \nprivate key to a safe place.",
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(valueToCopy);
    setOpenSnack(true);
  };
  const print = () => {
    navigator.clipboard.writeText(valueToCopy);
  };

  const handleCloseSnack = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const handleClose = () => {
    setOpenAlert(true);
  };

  const handleOk = () => {
    setOpenAlert(false);

    onClose && onClose();
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnack}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <BootstrapDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: "black" }}>
          Save Your Private Key.
        </DialogTitle>
        <DialogContent dividers sx={{ color: "grey", whiteSpace: "pre-line" }}>
          {valueToCopy && (
            <Tooltip title="Copy private key">
              <Box
                sx={{
                  bgcolor: "lightgrey",
                  p: 2,
                  color: "black",
                  fontWeight: "bold",
                  width: "100%",
                  overflowWrap: "break-word",
                  textAlign: "center",
                }}
                onClick={copyToClipboard}
              >
                {valueToCopy}
              </Box>
            </Tooltip>
          )}
          <DialogContentText
            id="alert-dialog-description"
            align="center"
            mt={2}
            color="secondary"
          >
            <strong>Do not lose it!</strong> It cannot be recovered if you lose
            it. <br />
            <strong>Do not share it!</strong> Your funds will be stolen if you
            use this file on a malicious/phishing site. <br />
            <strong>Make a backup!</strong> Secure it like the millions of
            dollars it may one day be worth. <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="outlined" onClick={print}>
            Print
          </Button> */}
          <Button variant="contained" onClick={copyToClipboard}>
            Copy
          </Button>
        </DialogActions>
        <Snackbar
          open={openSnack}
          autoHideDuration={2000}
          onClose={handleCloseSnack}
          message="Copied to clipboard"
          action={action}
        />
        <AlertDialog
          title={isError.title}
          description={isError.description}
          open={openAlert}
          onClose={() => setOpenAlert(false)}
          onOk={handleOk}
          okText="Yes"
        />
      </BootstrapDialog>
    </div>
  );
}
