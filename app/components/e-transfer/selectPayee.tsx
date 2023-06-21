import {
  Box,
  Checkbox,
  Fade,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  LinearProgress,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ValidationTextField } from "../entry";
import XSelect from "../x_select";
import XAutocomplete from "../x_autocomplete";
import BootstrapInput from "../entry/bootstrapInput";
import { isValidEmail } from "@/utils";
import RequiredField from "../requiredField";

const customReturnAccounts = (arr: any[]) => {
  return arr
    ?.filter((obj: any) => {
      return obj.balance > 0;
    })
    .map((finalResult: any) => {
      return {
        value: finalResult.id,
        label: `${finalResult.currency} Wallet xxxxxxx555 - ${
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

export default function SelectAccountPayee({
  account,
  setAccount,
  wallets,
  payee,
  setPayee,
  recentPayees,
  purposes,
  purpose,
  setPurpose,
  notes,
  setNotes,
  headers,
}: any) {
  const [accounts, setAccounts] = useState<any>();
  const [payees, setPayees] = useState<any>();
  const [payeeEmail, setPayeeEmail] = useState("");
  const [isEmailFetching, setIsEmailFetching] = useState(false);
  const [isEmailFound, setIsEmailFound] = useState("");
  const [query, setQuery] = useState("idle");
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

      if (account != null || account.length > 0) setAccount(_accounts[0].label);
    }

    /* if (recentPayees != null) {
      const _payees = customReturnPayees(recentPayees);
      setPayees(_payees);

      if (_payees != null) setPayee(_payees[0].label);
    } */
  }, [wallets]);

  const handleEmailLookup = (value: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      setQuery("idle");
    }

    setPayeeEmail(value);
    console.log(payeeEmail);
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
    setIsEmailFetching(true);
    setPayees(null);
    setIsEmailFound("");
    setPayee("");

    timerRef.current = window.setTimeout(() => {
      fetch(`/api/accounts?email=${value}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("result", result);
          if (result !== null && result.length > 0) {
            setIsEmailFound("");
            console.log("walles", result[0].wallets);
            const _payees = customReturnPayees(result[0].wallets);
            console.log("walles", _payees);
            setPayees(_payees);
            //setPayee(result[0]);

            if (_payees != null) setPayee(_payees[0].label);
          } else {
            setIsEmailFound(
              "No account found, please verify that you haven't mistyped the email. \n<strong>Note!</strong> Also be sure that the user you are trying to pay is registered with xBorderPay."
            );

            setQuery("error");
          }
          setIsEmailFetching(false);

          setQuery("success");
        })
        .catch((error) => {
          console.log("error: ", error);
          setIsEmailFetching(false);
          setQuery("error");
        });
    }, 1000);
  };

  //console.log("payee: ", payee);

  return (
    <Box>
      <Typography variant="h6" mb={1}>
        Transfer from
      </Typography>
      <Typography my={2}>
        Account
        <RequiredField />
      </Typography>
      {accounts && (
        <XAutocomplete
          id="accounts"
          value={account}
          setValue={setAccount}
          disableClearable
          data={accounts}
          mt={1}
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
      <Box sx={{ height: 40, mb: 4 }}>
        {query === "success" ? (
          payees &&
          payees.length > 0 && (
            <Fade
              in={query === "success"}
              style={{
                transitionDelay: query === "success" ? "100ms" : "0ms",
              }}
              unmountOnExit
            >
              <XAutocomplete
                id="payees"
                value={payee}
                setValue={setPayee}
                disableClearable
                data={payees}
                mt={1}
              />
            </Fade>
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
