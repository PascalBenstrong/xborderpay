import React from "react";
import { useRouter } from 'next/navigation';
import { Wallet } from "@/types";
import {
  Avatar,
  Button,
  Paper,
  Slide,
  Typography,
  useMediaQuery,
  useTheme,
  DialogContent,
  Stack,
  Box,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import AddIcon from '@mui/icons-material/Add';
import { BootstrapDialog, BootstrapDialogTitle, DialogTransition } from "../dialog";
import TextIcon from "../textIcon";
import XIconButton from "../button/iconButton";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import PaymentsIcon from "@mui/icons-material/Payments";
import SafetyCheckIcon from "@mui/icons-material/SafetyCheck";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ConvertIcon from '@mui/icons-material/CompareArrows';
import SendIcon from '@mui/icons-material/ArrowUpward';

export interface SimpleDialogProps {
  open: boolean;
  wallet: Wallet | null;
  onClose: (value: string) => void;
}

export default function WalletDetailsDialog({
  onClose,
  open,
  wallet,
}: SimpleDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  
  const router = useRouter();
  const handleClose = () => {
    onClose("close");
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  const handleTopup = () => {
    
  }

  const handleCovertion = () => {
    
  }

  const handleSend = () => {
    router.push("/e-transfer");
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      TransitionComponent={DialogTransition}
      keepMounted
      fullScreen={fullScreen}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        {wallet?.currency} Balance
      </BootstrapDialogTitle>
      <DialogContent
        dividers
        sx={{ bgcolor: "background.default", p: 2, height: "100%" }}
      >
        <Paper sx={{ bgcolor: "secondary.main", p: 2}}>
          <Avatar sx={{ bgcolor: "primary.main" }} aria-label="currency">
            {wallet?.currency}
          </Avatar>
          <Typography variant="h6" fontWeight={700} mt={2}>
            <Box component="span" sx={{fontSize: 12}}>{wallet?.currency}</Box> {wallet?.balance.toFixed(2)}
          </Typography>
          <Stack direction="row" py={2} spacing={2} alignItems="center">
            <AccountBalanceIcon fontSize="inherit" />
            <Button size="small">Get account details</Button>
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <XIconButton
              Icon={<AddIcon />}
              text="Add"
              color="primary.main"
              onClick={handleTopup}
            />
            <XIconButton
              Icon={<ConvertIcon />}
              text="Convert"
              color="primary.main"
              onClick={handleCovertion}
            />
            <XIconButton
              Icon={<SendIcon />}
              text="Send"
              color="primary.main"
              onClick={handleSend}
            />
          </Stack>
        </Paper>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          mt={3}
        >
          <MeetingRoomIcon
            fontSize="large"
            color="primary"
            sx={{ fontSize: 50 }}
          />
          <Typography
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", fontSize: 28, lineHeight: 1.5, mt: 2 }}
          >
            THE SAFE HOME FOR <br />
            YOUR MONEY
          </Typography>
        </Stack>
        <TextIcon
          Icon={SwapVertIcon}
          text="Add, convert, send, and receive money securely"
        />
        <TextIcon
          Icon={SafetyCheckIcon}
          text="We safeguard 100% of your cash"
        />
        <TextIcon
          Icon={PaymentsIcon}
          text="We follow strict regulations,everywhere we work"
        />
      </DialogContent>
    </BootstrapDialog>
  );
}
