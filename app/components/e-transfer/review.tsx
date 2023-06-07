import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Unstable_Grid2 as Grid,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import UserInfoCard from "./userInfoCard";
import { ValidationTextField } from "../entry";

export default function Review() {
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={6}>
        <Typography variant="h6" mb={1}>
          From
        </Typography>
        <UserInfoCard />
        <Typography variant="h6" mb={1} mt={2}>
          Amount
        </Typography>
        <Stack direction="row" alignItems="center" sx={{ py: 1 }}>
          <img
            loading="lazy"
            width="30"
            height={15}
            src={`https://flagcdn.com/w20/us.png`}
            srcSet={`https://flagcdn.com/w40/us.png 2x`}
            alt="USD"
          />{" "}
          <Typography color="lightgrey" px={1}>
            USD
          </Typography>
          <Typography color="white" px={1}>
            200.00
          </Typography>
        </Stack>
        <Box sx={{ borderLeft: "1px solid lightGrey", pl: 2, py: 3, ml: 5 }}>
          <Typography>Fees: USD 5.00</Typography>
          <Typography mt={1}>Rate: 19.32</Typography>
        </Box>
        <Stack direction="row" alignItems="center" sx={{ py: 1 }}>
          <img
            loading="lazy"
            width="30"
            height={15}
            src={`https://flagcdn.com/w20/za.png`}
            srcSet={`https://flagcdn.com/w40/za.png 2x`}
            alt="ZAR"
          />{" "}
          <Typography color="lightgrey" px={1}>
            ZAR
          </Typography>
          <Typography color="white" px={1}>
            1000.00
          </Typography>
        </Stack>
        <Typography mb={2} mt={4}>
          Estimated Delivery Date: Near Real Time(IMPS)
        </Typography>
      </Grid>
      <Grid xs={12} md={6}>
        <Typography variant="h6" mb={1}>
          To
        </Typography>
        <UserInfoCard />
        <Typography mb={2} mt={4}>
          Purpose of Transfer: 
        </Typography>
        <Typography mb={2} color="lightgrey">
          Software Development
        </Typography>
        <Typography my={2}>Notes: </Typography>
        <Typography mb={2} mt={2}  color="lightgrey">
          None
        </Typography>
        <FormGroup sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox defaultChecked disabled color="primary"/>}
            label="Send money on behalf of myself and not on behalf of a third party"
            sx={{bgcolor: "white"}}
          />
        </FormGroup>
      </Grid>
    </Grid>
  );
}
