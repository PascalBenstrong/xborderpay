import { Box, Typography, Stack } from "@mui/material";
import React from "react";

export default function UserInfoCard({data,walletId}:any) {
  let _walletId = data?.wallets?.find((x: any) => x.id === walletId);

  return (
    <Box sx={{ border: "1px solid lightGrey", p: 2, color: "lightGrey" }}>
      <Typography variant="h6" mb={2}>
        {`${data?.firstName} ${data?.lastName}`}
      </Typography>
      <Typography>{data?.email}</Typography>
      {data?.mobileNumber &&  <Typography>data?.mobileNumber</Typography>}
     
      {/* <Typography mt={1}>
        22 Bree Street, Cape Town, Western Cape, South Africa
      </Typography>
      <Typography>Born 1966 Aug 22 in South Africa</Typography> */}

      <Stack direction="row" mt={2} spacing={2}>
        <Box>
          {/* <Typography fontWeight="bold">FI Id</Typography> */}
          <Typography fontSize={12} fontWeight="bold">Account No.</Typography>
          {/* <Typography fontWeight="bold">Bank Name</Typography> */}
        </Box>
        <Box>
          {/* <Typography>004-12345</Typography> */}
          <Typography>{_walletId?.account?.id}</Typography>
          {/* <Typography>ABSA Bank</Typography> */}
        </Box>
      </Stack>
    </Box>
  );
}
