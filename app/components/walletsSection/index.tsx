"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import { Dialog, Unstable_Grid2 as Grid } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import useSWRImmutable from "swr/immutable";
import { Paper, Stack } from "@mui/material";
import WalletCard from "../wallet_card";

const emails = ["US Wallet", "ZAR Wallet"];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{ bgcolor: "secondary.main" }}>
        Choose currency for new wallet
      </DialogTitle>
      <List sx={{ pt: 0, bgcolor: "background.default" }}>
        {emails.map((wallet, index) => (
          <ListItem key={index} disableGutters>
            <ListItemButton
              onClick={() => handleListItemClick(wallet)}
              key={wallet}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "primary.main" }}>ZAR</Avatar>
              </ListItemAvatar>
              <ListItemText primary={wallet} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick("addAccount")}
          >
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add account" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

function GetData(headers: any) {
  var requestOptions: any = {
    method: "GET",
    headers: headers ?? {},
    redirect: "follow",
  };

  const fetcher = (url: string) =>
    fetch(url, requestOptions).then((res) => res.json());

  const { data, error, isLoading } = useSWRImmutable("/api/wallets", fetcher, {
    refreshInterval: 60000,
  });

  //const { data, isError, isLoading } = useFetcher(`/api/transactions`);

  //console.log("data: ", data);

  return {
    wallets: data,
    isLoading: true,
    isError: false,
  };
}

export default function WalletsSection({ headers }: any) {
  const { wallets, isError, isLoading } = GetData(headers);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  //console.log("wallets: ",data)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {wallets &&
          wallets.map((item: any, index: number) => (
            <Grid xs={6} lg={3} key={index}>
              <WalletCard
                name={item.name}
                balance={item.balance}
                currency={item.currency}
              />
            </Grid>
          ))}
          <Grid xs={3}>
        <Paper
          component={Button}
          sx={{ bgcolor: "secondary.main", p: 2, height: "100%" }}
          onClick={handleClickOpen}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ border: "4px dashed white", height: "100%", p: 2 }}
          >
            <AddCircleIcon fontSize="large" />
            <Typography variant="body2" my={2}>
              Add a new currency wallet
            </Typography>
          </Stack>
        </Paper>
              
            </Grid>
      </Grid>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
