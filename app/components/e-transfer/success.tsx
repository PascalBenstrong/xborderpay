import { Typography, Button, Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Verificationcheck from "./verificationcheck";

export default function ETransferSuccess({
  fromAmount,
  purpose,
  reference,
  handleReset,
}: any) {
  const [query, setQuery] = useState("idle");
  const timerRef = useRef<number>();
  const [showStatus, setShowStatus] = React.useState(false);

  const animateStatus = () => {
    timerRef.current = window.setTimeout(() => {
      setShowStatus(true);
    }, 500);
  };
  useEffect(() => {
    animateStatus();
  }, [animateStatus]);

  return (
    <>
      <Typography variant="body1" mb={1}>
        Payment for{" "}
        <Box component="span" sx={{ fontWeight: "bold" }}>
          {purpose}
        </Box>{" "}
        has been received{" "}
        <Box component="span" sx={{ fontWeight: "bold" }}>
          {fromAmount.currency} {fromAmount.amount}
        </Box>
        .
      </Typography>
      <Typography>Reference No: {reference}</Typography>
      <Typography mt={3}>
        The transaction is successful finished, you can check the status of
        payment from home screen at anytime.
      </Typography>
      <Verificationcheck isSuccess={true} name="Sending Compliance Checks" />
      <Verificationcheck isSuccess={true} name="Receiving Compliance Checks" />
      <Verificationcheck isSuccess={true} name="Booking FX Rate" />
      <Verificationcheck
        isSuccess={true}
        name={`Generating IMPS Transaction: Reference # ${reference}`}
      />
      <Verificationcheck isSuccess={showStatus} name="Payment Successful" />

      <Button
        variant="outlined"
        LinkComponent={Link}
        href="/"
        sx={{ mt: 3, mr: 1 }}
      >
        Back To Home
      </Button>
      <Button
        variant="contained"
        LinkComponent={Link}
        href="/e-transfer"
        onClick={handleReset}
        sx={{ mt: 3, mr: 1 }}
      >
        Make Another Transfer
      </Button>
    </>
  );
}
