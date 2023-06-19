import React from "react";
import { Wallet, iWallet } from "@/types";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export interface SimpleDialogProps {
  open: boolean;
  wallet: Wallet | null;
  onClose: (value: string) => void;
}

export default function WalletDetailsDialog(props: SimpleDialogProps) {
  const { onClose, open, wallet } = props;

  const handleClose = () => {
    onClose("close");
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{ bgcolor: "secondary.main" }}>
        Choose currency for new wallet
      </DialogTitle>
      <Paper sx={{ bgcolor: "secondary.main", p: 2 }}>
        <Avatar sx={{ bgcolor: "primary.main" }} aria-label="currency">
          {wallet?.currency}
        </Avatar>
        <Typography variant="h6" fontWeight={700} mt={2}>
          {`${wallet?.currency} ${wallet?.balance}`}
        </Typography>
        <Typography variant="body2" my={2}>
          {wallet?.name}
        </Typography>
        <Button startIcon={<AddCircleIcon />}>Add Funds</Button>
      </Paper>
    </Dialog>
  );
}
