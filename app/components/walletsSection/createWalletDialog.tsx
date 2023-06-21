import { iWallet } from "@/types";
import { allCurrencies } from "@/utils";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  DialogContent,
  useMediaQuery,
  useTheme,
  Typography,
  Divider,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import {
  BootstrapDialog,
  BootstrapDialogTitle,
  DialogTransition,
} from "../dialog";
import useLocalStorage from "@/utils/useStorage";
import TransitionAlerts from "../alert";

export interface SimpleDialogProps {
  open: boolean;
  wallets?: iWallet[];
  headers: Headers;
  onClose: (value: string | iWallet) => void;
}

export default function CreateWallet(props: SimpleDialogProps) {
  const { onClose, open, wallets, headers } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pkValue, setPkValue] = useLocalStorage("shouldRequestKey", "");

  const handleClose = () => {
    onClose("close");
  };

  const handleListItemClick = (value: iWallet) => {
    handleSubmit(value);
  };

  const handleSubmit = async (payload: iWallet) => {
    try {
      setIsProcessing(true);

      var requestOptions: any = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
        redirect: "follow",
      };

      const response = await fetch("/api/wallets", requestOptions);

      if (response.ok) {
        const data = await response.json();

        if (data) {
          setPkValue(data.privateKey);
          console.log("sucess");
          setIsProcessing(false);
          onClose(data.wallet);
        }
      } else {
        const error = await response.text();
        console.log("error:", error);
        setErrorMessage(error);
        setIsProcessing(false);
      }
    } catch (ex) {
      console.log("error", ex);
      setErrorMessage("Something went wrong try again later!");
      setIsProcessing(false);
    }
  };

  // Array of currencies already used to create wallets
  const usedCurrencies = wallets?.map((item) => item.currency);

  //Filter out the used currencies from the available currencies
  const remainCurrencies = allCurrencies.filter(
    (item) => !usedCurrencies?.includes(item.currency)
  );

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      TransitionComponent={DialogTransition}
      keepMounted
      fullScreen={fullScreen}
    >
      <BootstrapDialogTitle onClose={handleClose} id={"newWallet"}>
        Create new wallet
      </BootstrapDialogTitle>
      <DialogContent
        dividers
        sx={{
          bgcolor: "background.default",
          p: 2,
          height: "100%",
        }}
      >
        <TransitionAlerts
          severity="error"
          message={errorMessage}
          open={errorMessage.length > 0}
        />
        <Typography
          gutterBottom
          align="left"
          color="lightgrey"
          sx={{ lineHeight: 1.5, minWidth: 350 }}
        >
          Choose currency for new wallet
        </Typography>
        <Divider sx={{ bgcolor: "lightgrey" }} />
        <List sx={{ pt: 0, minWidth: 250 }}>
          {remainCurrencies.map((wallet, index) => (
            <ListItem key={index} disableGutters>
              <ListItemButton
                onClick={() => handleListItemClick(wallet)}
                key={wallet.name}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {wallet.currency}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={wallet.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isProcessing}
          //onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </DialogContent>
    </BootstrapDialog>
  );
}
