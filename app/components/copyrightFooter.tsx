import { Box } from "@mui/material";
import Link from "next/link";

export default function Copyright(props: any) {
    return (
        <Box
          sx={{
            width: "100%",
            height: 45,
            bgcolor: "black",
            display: { xs: "block", md: "flex" },
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: "center",
            px: 5,
            py: 1,
            position: "absolute",
            bottom: 0,
            color: "lightGrey"
          }}
        >
          <Box display={{ xs: "none", md: "block" }}>
            xBorderPay
            <Link href="/" className="no-text ico-apple"></Link>
          </Box>
  
          <p className="itc-footer__links">
            Copyright © {new Date().getFullYear()} xBorderPay. All rights
            reserved.
          </p>
        </Box>
    );
  }