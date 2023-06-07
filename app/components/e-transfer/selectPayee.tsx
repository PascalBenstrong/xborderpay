import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import { ValidationTextField } from "../entry";
import XSelect from "../x_select";

const customReturnFiltere = (arr:any[]) => {
  return arr?.filter((obj:any) => {
    return obj.balance > 0;
  })
  .map((finalResult:any) => {
      return {
        value: finalResult.id,
        name: `${finalResult.currency} Wallet xxxxxxx555 - ${finalResult.currency} ${finalResult.balance.toFixed(2)}`
      }
  });
}

export default function SelectAccountPayee({account,setAccount, wallets}:any) {
  const [accounts,setAccounts] = useState<any>();
  useEffect(()=>{

    if(wallets != null)
    {
      const _accounts = customReturnFiltere(wallets);
      setAccounts(_accounts);

      if(account != null ||  account.length > 0)
      setAccount(_accounts[0].value)

    }

  },[wallets])
  
  return (
    <Box>
      <Typography variant="h6" mb={1}>
        Transfer from
      </Typography>
      <Typography my={2}>Account</Typography>
      <XSelect value={account} setValue={setAccount} data={accounts}/>
      <Typography variant="h6" mt={3}>
        To
      </Typography>
      <Typography my={2}>Payee</Typography>
      <ValidationTextField id="payee" fullWidth />
      <Typography mb={2} mt={8}>
        Purpose of Transfer
      </Typography>
      <ValidationTextField id="puroseOfTransfer" fullWidth />
      <Typography my={2}>Note (Optional)</Typography>
      <ValidationTextField id="note" fullWidth multiline rows={4} />
      <FormGroup sx={{ my: 2 }}>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Send money on behalf of myself and not on behalf of a third party"
        />
      </FormGroup>
    </Box>
  );
}
