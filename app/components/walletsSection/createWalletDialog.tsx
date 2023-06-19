import { iWallet } from '@/types';
import { allCurrencies } from '@/utils';
import { Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import React from 'react'

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: iWallet | null;
    wallets?: iWallet[];
    onClose: (value: string | iWallet) => void;
  }

export default function CreateWallet(props: SimpleDialogProps) {
    const { onClose, selectedValue, open, wallets } = props;

    const handleClose = () => {
      onClose("close");
    };
  
    const handleListItemClick = (value: string | iWallet) => {
      onClose(value);
    };
  
    // Array of currencies already used to create wallets
    const usedCurrencies = wallets?.map((item) => item.currency);
  
    //Filter out the used currencies from the available currencies
    const remainCurrencies = allCurrencies.filter(item => !usedCurrencies?.includes(item.currency))
  
    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle sx={{ bgcolor: "secondary.main" }}>
          Choose currency for new wallet
        </DialogTitle>
        <List sx={{ pt: 0, bgcolor: "background.default" }}>
          {remainCurrencies.map((wallet, index) => (
            <ListItem key={index} disableGutters>
              <ListItemButton
                onClick={() => handleListItemClick(wallet)}
                key={wallet.name}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>{wallet.currency}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={wallet.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
    );
}
