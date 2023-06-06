import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Unstable_Grid2 as Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { ValidationTextField } from "../entry";
import UserInfoCard from "./userInfoCard";

export default function SelectAccountPayee() {
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Typography variant="h6" mb={1}>
          Transfer from
        </Typography>
        <Typography my={2}>Account</Typography>
        <ValidationTextField id="account" fullWidth color="info" />
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
      </Grid>
      <Grid xs={12} md={4}>
        <Typography variant="h6" mb={1}>
          From
        </Typography>
        <UserInfoCard/>
        <Typography variant="h6" mt={3} mb={1}>
          To
        </Typography>
        <UserInfoCard/>
      </Grid>
    </Grid>
  );
}
