import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ValidationTextField } from "../entry";
import XSelect from "../x_select";
import XAutocomplete from "../x_autocomplete";
import BootstrapInput from "../entry/bootstrapInput";

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
      label: `${finalResult.firstName} ${finalResult.firstName} (${finalResult.email})`,
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
}: any) {
  const [accounts, setAccounts] = useState<any>();
  const [payees, setPayees] = useState<any>();
  const [payeeEmail, setPayeeEmail] = useState("");
  useEffect(() => {
    if (wallets != null) {
      const _accounts = customReturnAccounts(wallets);
      setAccounts(_accounts);

      if (account != null || account.length > 0) setAccount(_accounts[0].label);
    }

    if (recentPayees != null) {
      const _payees = customReturnPayees(recentPayees);
      setPayees(_payees);

      if (_payees != null) setPayee(_payees[0].label);
    }
  }, [wallets, recentPayees]);

  //console.log("payee: ", payee);

  return (
    <Box>
      <Typography variant="h6" mb={1}>
        Transfer from
      </Typography>
      <Typography my={2}>Account</Typography>
      {accounts && (
        <XAutocomplete
          id="accounts"
          value={account}
          setValue={setAccount}
          data={accounts}
        />
      )}

      <Typography variant="h6" mt={3}>
        To
      </Typography>
      <Typography my={2}>Payee</Typography>
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
          onChange={(e) => setPayeeEmail(e.target.value)}
          sx={{
            color: "black",
            "& .MuiInputBase-input": { backgroundColor: "tranparent" },
          }}
          autoFocus
          required
        />
        <Typography sx={{ color: "lightGrey", fontSize: 10, mt: 1 }}>
          Look up the payee you wish to pay
        </Typography>
      </FormControl>
      {payees && (
        <XAutocomplete
          id="payees"
          value={payee}
          setValue={setPayee}
          data={payees}
        />
      )}
      <Typography mb={2} mt={8}>
        Purpose of Transfer
      </Typography>
      {purposes && (
        <XAutocomplete
          id="puroseOfTransfer"
          freeSolo
          value={purpose}
          setValue={setPurpose}
          data={purposes}
        />
      )}
      <Typography my={2}>Note (Optional)</Typography>
      <ValidationTextField
        id="note"
        fullWidth
        multiline
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <FormGroup sx={{ my: 2 }}>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Send money on behalf of myself and not on behalf of a third party"
        />
      </FormGroup>
    </Box>
  );
}
