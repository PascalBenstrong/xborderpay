import { Box, Typography, Stack } from "@mui/material";
import React from "react";

export default function UserInfoCard({data}:any) {
  return (
    <Box sx={{ border: "1px solid lightGrey", p: 2, color: "lightGrey" }}>
      <Typography variant="h6" mb={2}>
        Mark Woods
      </Typography>
      <Typography>mark.wood@gmail.com</Typography>
      <Typography>+27 80 000 0000</Typography>
      <Typography mt={1}>
        22 Bree Street, Cape Town, Western Cape, South Africa
      </Typography>
      <Typography>Born 1966 Aug 22 in South Africa</Typography>
      <Stack direction="row" mt={2} spacing={2}>
        <Box>
          <Typography fontWeight="bold">FI Id</Typography>
          <Typography fontWeight="bold">Account No.</Typography>
          <Typography fontWeight="bold">Bank Name</Typography>
        </Box>
        <Box>
          <Typography>004-12345</Typography>
          <Typography>123456789012</Typography>
          <Typography>ABSA Bank</Typography>
        </Box>
      </Stack>
    </Box>
  );
}
