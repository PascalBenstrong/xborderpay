import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import AddIcon from "@mui/icons-material/Add";
import {
  BootstrapDialog,
  BootstrapDialogTitle,
  DialogTransition,
} from "../../dialog";
import TextIcon from "../../textIcon";
import XIconButton from "../../button/iconButton";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import PaymentsIcon from "@mui/icons-material/Payments";
import SafetyCheckIcon from "@mui/icons-material/SafetyCheck";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ConvertIcon from "@mui/icons-material/CompareArrows";
import SendIcon from "@mui/icons-material/ArrowUpward";
import AccountDetails from "./details";
import AccountTopup from "./topup";
import AlertDialog from "@/components/alertDialog";

export interface SimpleDialogProps {
  open: boolean;
  wallet: Wallet | null;
  onClose: (value: string) => void;
  onUpdate?: (value: Wallet) => void;
}

enum AccountState {
  balance,
  details,
  topup,
  convert,
}

export default function WalletDetailsDialog({
  onClose,
  open,
  wallet,
  onUpdate,
}: SimpleDialogProps) {
  const router = useRouter();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [accountView, setAccountView] = useState(AccountState.topup);
  const [openAlert, setOpenAlert] = useState(false);
  const [isError, setIsError] = useState({
    title: "",
    description: "",
  });

  const handleClose = () => {
    if (accountView === AccountState.balance) onClose("close");

    setAccountView(AccountState.balance);
  };

  const handleTopup = () => {
    setAccountView(AccountState.topup);
  };

  const handleCovertion = () => {};

  const handleSend = () => {
    if (wallet && wallet?.balance <= 0) {
      setIsError({
        title: "Add money",
        description: `You will need to add money to your \n${wallet.currency} balance before you can send ${wallet.currency}.`,
      });
      setOpenAlert(true);

      return;
    }

    router.push("/e-transfer");
  };

  const handleTopupUpdate = (value: Wallet) => {
    onUpdate && onUpdate(value);
    handleClose();
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      TransitionComponent={DialogTransition}
      keepMounted
      fullScreen={fullScreen}
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleClose}
        hasBackButton={accountView !== AccountState.balance}
      >
        {wallet?.currency} Balance
      </BootstrapDialogTitle>
      <DialogContent
        dividers
        sx={{ bgcolor: "background.default", p: 2, height: "100%" }}
      >
        {accountView == AccountState.balance && (
          <Box>
            <Paper sx={{ bgcolor: "secondary.main", p: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main" }} aria-label="currency">
                {wallet?.currency}
              </Avatar>
              <Typography variant="h6" fontWeight={700} mt={2}>
                <Box component="span" sx={{ fontSize: 12 }}>
                  {wallet?.currency}
                </Box>{" "}
                {wallet?.balance.toFixed(2)}
              </Typography>
              <Stack direction="row" py={2} spacing={2} alignItems="center">
                <AccountBalanceIcon fontSize="inherit" />
                <Button
                  size="small"
                  onClick={() => setAccountView(AccountState.details)}
                >
                  Show account details
                </Button>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
              >
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
                sx={{
                  fontWeight: "bold",
                  fontSize: 28,
                  lineHeight: 1.5,
                  mt: 2,
                }}
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
          </Box>
        )}
        {accountView == AccountState.details && wallet && (
          <AccountDetails accountHolder="Benoit Tshiawu" wallet={wallet} />
        )}

        {accountView == AccountState.topup && wallet && (
          <AccountTopup wallet={wallet} updateChange={handleTopupUpdate} />
        )}
        <AlertDialog
          title={isError.title}
          description={isError.description}
          open={openAlert}
          onClose={()=>setOpenAlert(false)}
        />
      </DialogContent>
    </BootstrapDialog>
  );
}
