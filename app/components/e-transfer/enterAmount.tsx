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
  
  export default function EnterAmount() {
    return (
      <Box width="100%">
        <Typography variant="h6" mb={1}>
            Amount
          </Typography>
          <ValidationTextField id="fromCurrency" color="info" value="200.00" />
          
          <Typography my={2}>Fees: USD 5.00 (included)</Typography>
          <Typography my={2}>Rate: 52.01</Typography>
          <ValidationTextField id="toCurrency" value="1000.51" />
          <Typography mb={2} mt={4}>
            Estimated Delivery Date: Near Real Time(IMPS)
          </Typography>
      </Box>
    );
  }
  