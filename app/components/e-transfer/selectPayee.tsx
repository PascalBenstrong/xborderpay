import {
  Box,
  Fade,
  FormControl,
  InputLabel,
  LinearProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import XAutocomplete from "../x_autocomplete";
import BootstrapInput from "../entry/bootstrapInput";
import { isValidEmail } from "@/utils";
import RequiredField from "../requiredField";

const customReturnAccounts = (arr: any[]) => {
  return arr
    ?.filter((obj: any) => {
      return obj.balance >= 0;
    })
    .map((finalResult: any) => {
      return {
        value: finalResult.id,
        label: `${finalResult.currency} Wallet ${finalResult.account.id} - ${
          finalResult.currency
        } ${finalResult.balance.toFixed(2)}`,
      };
    });
};

const customReturnPayees = (arr: any[]) => {
  return arr?.map((finalResult: any) => {
    return {
      value: finalResult.id,
      label: `${finalResult.currency} Wallet (${finalResult.account.id})`,
    };
  });
};

const getLabelFromValue = (value: string, arr: any[]) => {
  const _arr = arr.find((x: any) => x.value === value);
  return _arr?.label ?? "";
};

export default function SelectAccountPayee({
  myWalletId,
  setMyWalletId,
  wallets,
  payee,
  setPayee,
  recentPayees,
  purposes,
  purpose,
  setPurpose,
  toWalletId,
  setToWalletId,
  headers,
  payeeEmail,
  setPayeeEmail,
  payeeWallets,
  setPayeeWallets,
  query,
  setQuery,
  isLoading,
}: any) {
  const [accounts, setAccounts] = useState<any>();
  const [isEmailFetching, setIsEmailFetching] = useState(false);
  const [isEmailFound, setIsEmailFound] = useState("");
  const timerRef = useRef<number>();

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    []
  );

  useEffect(() => {
    if (wallets != null) {
      const _accounts = customReturnAccounts(wallets);
      setAccounts(_accounts);

      if (_accounts.length > 0) setMyWalletId(_accounts[0].value);
    }
  }, [wallets, setMyWalletId, setAccounts]);

  const handleEmailLookup = (value: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      setQuery("idle");
    }

    setPayeeEmail(value);
    if (!isValidEmail(value)) {
      return;
    }

    /* if (query !== "idle") {
      setQuery("idle");
      return;
    } */

    setQuery("progress");

    var requestOptions: any = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };

    //reset the values
    setPayeeWallets(null);
    setIsEmailFound("");
    setPayee(null);
    setToWalletId("");

    timerRef.current = window.setTimeout(() => {
      fetch(`/api/accounts?email=${value}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("result", result);
          if (result !== null && result.length > 0) {
            setIsEmailFound("");
            //console.log("walles", result[0].wallets);
            const _payees = customReturnPayees(result[0].wallets);
            //console.log("walles", _payees);
            setPayeeWallets(_payees);
            setPayee(result[0]);

            if (_payees != null) setToWalletId(_payees[0].value);
          } else {
            setIsEmailFound(
              "No account found, please verify that you haven't mistyped the email. \n<strong>Note!</strong> Also be sure that the user you are trying to pay is registered with xBorderPay."
            );

            setQuery("error");
          }
          setQuery("success");
        })
        .catch((error) => {
          console.log("error: ", error);
          setQuery("error");
        });
    }, 1000);
  };

  //get and set account id
  const handleAccountChange = (value: string) => {
    let _wallet = accounts.find((x: any) => x.label === value);
    setMyWalletId(_wallet?.value);
  };

  //get and set payee account id
  const handlePayeeChange = (value: string) => {
    let _wallet = payeeWallets.find((x: any) => x.label === value);
    setToWalletId(_wallet?.value);
  };

  const LoadingSkeleton = () => {
    return (<>
      <Skeleton variant="rectangular" width="30%" height={30} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="20%" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={55} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="10%" height={30} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="20%" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={55} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="40%" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={55} sx={{ mb: 1 }} />
      <Skeleton variant="rectangular" width="40%" height={45} sx={{ mb: 2 }} />
    </>)
  }

  return isLoading ? (
    <LoadingSkeleton/>
  ) : (
    <Box>
      <Typography variant="h6" mb={1}>
        Transfer from
      </Typography>
      <Typography my={2}>
        Account
        <RequiredField />
      </Typography>
      {accounts ? (
        <XAutocomplete
          id="accounts"
          value={getLabelFromValue(myWalletId, accounts)}
          setValue={handleAccountChange}
          disableClearable
          data={accounts}
          mt={1}
        />
      ) : (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={55}
          sx={{ mb: 1 }}
        />
      )}

      <Typography variant="h6" mt={3}>
        To
      </Typography>
      <Typography my={2}>
        Payee
        <RequiredField />
      </Typography>
      <FormControl variant="standard" fullWidth>
        <InputLabel shrink sx={{ color: "lightGrey" }} htmlFor="email">
          Payee Email
        </InputLabel>
        <BootstrapInput
          placeholder="Please enter your email address"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={payeeEmail}
          onChange={(e) => handleEmailLookup(e.target.value)}
          sx={{
            color: "white",
            "& .MuiInputBase-input": { backgroundColor: "tranparent" },
          }}
          autoFocus
          required
        />
        <Typography sx={{ color: "lightGrey", fontSize: 10, mt: 1 }}>
          Look up the payee you wish to pay
        </Typography>
      </FormControl>
      {isEmailFound && (
        <Typography
          sx={{ color: "#7676a7", fontSize: 12, whiteSpace: "pre-line", mt: 1 }}
        >
          {isEmailFound}
        </Typography>
      )}
      <Box>
        {query === "success" ? (
          payeeWallets &&
          payeeWallets.length > 0 && (
            <XAutocomplete
              id="payeeWallets"
              value={getLabelFromValue(toWalletId, payeeWallets)}
              setValue={handlePayeeChange}
              disableClearable
              data={payeeWallets}
              mt={1}
            />
          )
        ) : (
          <Fade
            in={query === "progress"}
            style={{
              transitionDelay: query === "progress" ? "100ms" : "0ms",
            }}
            unmountOnExit
          >
            <LinearProgress />
          </Fade>
        )}
      </Box>

      <Typography mb={0} mt={3}>
        Purpose of Transfer
        <RequiredField />
      </Typography>
      {purposes && (
        <XAutocomplete
          id="puroseOfTransfer"
          freeSolo
          value={purpose}
          setValue={setPurpose}
          data={purposes}
          mt={1}
        />
      )}
    </Box>
  );
}
