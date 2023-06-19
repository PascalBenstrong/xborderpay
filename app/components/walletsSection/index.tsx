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
import { Box, Dialog, Unstable_Grid2 as Grid } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import useSWRImmutable from "swr/immutable";
import { Paper, Stack } from "@mui/material";
import WalletCard from "../wallet_card";
import { Currency, Wallet, iWallet } from "@/types";
import { useMemo } from "react";
import { type } from "os";
import { allCurrencies } from "@/utils";
import CreateWallet from "./createWalletDialog";
import WalletDetailsDialog from "./walletDetailsDialog";

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

  const wallets: any[] = data;

  return {
    wallets,
    isLoading: true,
    isError: false,
  };
}

export default function WalletsSection({ headers }: any) {
  const { wallets, isError, isLoading } = GetData(headers);
  const [open, setOpen] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedWallet, setSelectedWallet] = React.useState<Wallet | null>(
    null
  );
  const [selectedValue, setSelectedValue] = React.useState<iWallet | null>(
    null
  );

  //console.log("wallets: ",data)

  const _wallets: Wallet[] = useMemo(() => {
    let myWallets = wallets;

    if (selectedValue !== null) {
      const wallet = {
        userId: "648f2dc74469b5d1e702451e",
        name: "EUR Wallet",
        currency: "EUR",
        account: {
          id: "0.0.14827473",
          publicKey:
            "302a300506032b65700321004f256f5baa993fcaf5dc623a2d4f98ec4e477cb8cfe1d77fd95280225abdfcca",
          type: "hedera",
        },
        balance: 0,
        id: "648f9ea5ef1d4e69bf3d7dbd",
      };

      myWallets?.push(wallet);
    }

    return myWallets;
  }, [wallets, selectedValue]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string | iWallet) => {
    setOpen(false);
    if (typeof value === "object" && value !== null) {
      setSelectedValue(value);
    }
  };

  const handleDetailsPreview = (value: Wallet) => {
    setSelectedWallet(value);
    setOpenDetail(true);
  };

  const handleWalletDetailsClose = (value: string) => {
    setOpenDetail(false);
  };

  const handleUpdate = (value: Wallet) => {
    _wallets.filter((x) => {
      if (x.id === value.id) x.balance = value.balance;
      return x;
    });
  };

  return (
    <div>
      <Box sx={{ mt: 4, mb: 5 }}>
        <Grid container spacing={2}>
          {_wallets &&
            _wallets.map((item: Wallet, index: number) => (
              <Grid xs={6} sm={3} key={index}>
                <WalletCard
                  name={item.name}
                  balance={item.balance}
                  currency={item.currency}
                  handlePreview={() => handleDetailsPreview(item)}
                />
              </Grid>
            ))}
          {_wallets?.length < 4 && (
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
          )}
        </Grid>
      </Box>
      <CreateWallet
        selectedValue={selectedValue}
        open={open}
        wallets={_wallets}
        onClose={handleClose}
      />

      <WalletDetailsDialog
        open={openDetail}
        wallet={selectedWallet}
        onClose={handleWalletDetailsClose}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
