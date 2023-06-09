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
import SecurityAlert from "../securityAlert";

function GetData(headers: any) {
  var requestOptions: any = {
    method: "GET",
    headers: headers ?? {},
    redirect: "follow",
  };

  const fetcher = (url: string) =>
    fetch(url, requestOptions).then((res) => res.json());

  const { data, error, isLoading, mutate } = useSWRImmutable(
    "/api/wallets",
    fetcher,
    { refreshInterval: 1000, revalidateOnFocus: true }
  );

  //const { data, isError, isLoading } = useFetcher(`/api/transactions`);

  //console.log("data: ", data);

  const wallets: any[] = data;

  return {
    wallets,
    isLoading: isLoading,
    isError: error,
    mutate,
  };
}

export default function WalletsSection({ headers }: any) {
  const { wallets, isError, isLoading, mutate } = GetData(headers);
  const [open, setOpen] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [securityAlert, setSecurityAlert] = React.useState(false);
  const [valueToCopy, setValueToCopy] = React.useState("");
  const [selectedWallet, setSelectedWallet] = React.useState<Wallet | null>(
    null
  );
  const [selectedValue, setSelectedValue] = React.useState<iWallet | null>(
    null
  );

  const _wallets: Wallet[] = useMemo(() => {
    let myWallets = wallets;

    return myWallets;
  }, [wallets]);

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

  const handleSecurityAlertClose = () => {
    setSecurityAlert(false);
  };

  return (
    <div>
      <Box sx={{ mt: 4, mb: 5 }}>
        <Grid container spacing={2}>
          {Array.from(_wallets?.slice(0, 4) ?? new Array(4)).map((item: Wallet, index: number) => (
              <Grid xs={6} sm={3} key={index}>
                <WalletCard
                  name={item?.name}
                  balance={item?.balance}
                  currency={item?.currency}
                  handlePreview={() => !isLoading && handleDetailsPreview(item)}
                  isLoading={isLoading}
                />
              </Grid>
            ))}
          {!isLoading && _wallets?.length < 4 && (
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
        open={open}
        wallets={_wallets}
        onClose={handleClose}
        headers={headers}
        setValueToCopy={setValueToCopy}
        showSecurityAlert={() => setSecurityAlert(true)}
      />

      <WalletDetailsDialog
        open={openDetail}
        wallet={selectedWallet}
        onClose={handleWalletDetailsClose}
        onUpdate={handleUpdate}
        headers={headers}
      />

      {valueToCopy && (
        <SecurityAlert
          valueToCopy={valueToCopy}
          open={securityAlert}
          onClose={handleSecurityAlertClose}
        />
      )}
    </div>
  );
}
