import { Typography, Button } from "@mui/material";
import React from "react";
import Link from "next/link";
import Verificationcheck from "./verificationcheck";

export default function ETransferSuccess({handleReset}:any) {
  return (
    <>
      <Typography variant="h6" mb={1}>
        360 Design has been received CAD 200.00.
      </Typography>
      <Typography>Reference No: CAxxx723</Typography>
      <Typography mt={3}>
        The transaction is successful finished, you can check the status of
        payment from home screen at anytime.
      </Typography>
      <Verificationcheck isSuccess={true} name="Sending Bank Compliance Checks"/>
      <Verificationcheck isSuccess={true} name="Receiving Bank Compliance Checks"/>
      <Verificationcheck isSuccess={false} name="Booking FX Rate"/>
      <Verificationcheck isSuccess={false} name="Generating IMPS Transaction: Reference # 1238098123123"/>
      <Verificationcheck isSuccess={false} name="Payment Successful"/>

      <Button variant="outlined" LinkComponent={Link} href="/" sx={{ mt: 3, mr: 1 }}>
        Back To Home
      </Button>
      <Button variant="contained" LinkComponent={Link} href="/e-transfer" onClick={handleReset} sx={{ mt: 3, mr: 1 }}>
        Make Another Transfer
      </Button>
    </>
  );
}
