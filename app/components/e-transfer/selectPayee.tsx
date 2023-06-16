import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ValidationTextField } from "../entry";
import XSelect from "../x_select";
import XAutocomplete from "../x_autocomplete";

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

export default function SelectAccountPayee(
  {
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
  setNotes
}: any) {
  const [accounts, setAccounts] = useState<any>();
  const [payees, setPayees] = useState<any>();
  useEffect(() => {
    if (wallets != null) {
      const _accounts = customReturnAccounts(wallets);
      setAccounts(_accounts);

      if (account != null || account.length > 0) setAccount(_accounts[0].value);
    }

    if (recentPayees != null) {
      const _payees = customReturnPayees(recentPayees);
      setPayees(_payees);

      if(_payees != null) setPayee(_payees[0].label);
    }
  }, [wallets, recentPayees]);

  //console.log("payee: ", payee);

  return (
    <Box>
      <Typography variant="h6" mb={1}>
        Transfer from
      </Typography>
      <Typography my={2}>Account</Typography>
      {wallets && <XSelect value={account} setValue={setAccount} data={accounts} />}
      <Typography variant="h6" mt={3}>
        To
      </Typography>
      <Typography my={2}>Payee</Typography>
      {recentPayees && <XAutocomplete id="payees" value={payee} setValue={setPayee} data={payees}/>}
      <Typography mb={2} mt={8}>
        Purpose of Transfer
      </Typography>
      {purposes && (
        <XAutocomplete
          id="puroseOfTransfer"
          value={purpose}
          setValue={setPurpose}
          data={purposes}
        />
      )}
      <Typography my={2}>Note (Optional)</Typography>
      <ValidationTextField id="note" fullWidth multiline rows={4} value={notes} onChange={(e)=>setNotes(e.target.value)}/>
      <FormGroup sx={{ my: 2 }}>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Send money on behalf of myself and not on behalf of a third party"
        />
      </FormGroup>
    </Box>
  );
}
