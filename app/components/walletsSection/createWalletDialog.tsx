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
} from "@mui/material";
import React from "react";
import {
  BootstrapDialog,
  BootstrapDialogTitle,
  DialogTransition,
} from "../dialog";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: iWallet | null;
  wallets?: iWallet[];
  onClose: (value: string | iWallet) => void;
}

export default function CreateWallet(props: SimpleDialogProps) {
  const { onClose, selectedValue, open, wallets } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    onClose("close");
  };

  const handleListItemClick = (value: string | iWallet) => {
    onClose(value);
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
        <Typography
          gutterBottom
          align="left"
          color="lightgrey"
          sx={{  lineHeight: 1.5, minWidth: 350 }}
        >
          Choose currency for new wallet
        </Typography>
        <Divider sx={{bgcolor: 'lightgrey'}}/>
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
      </DialogContent>
    </BootstrapDialog>
  );
}
