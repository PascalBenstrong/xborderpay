"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
//import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
//import BootstrapInput from "../../../components/BootstrapInput";
import { LoginForm } from "./form";
import Copyright from "@/components/copyrightFooter";

export default function SignInPage() {
  return (
    <Box className="login-page">
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          height: { xs: "80vh", sm: "80vh" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: 0, sm: 5 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            marginTop: { sm: 5 },
            elevation: { xs: 0 },
            padding: 5,
            paddingTop: { xs: 8, sm: 3 },
            height: { xs: "100%", sm: "70%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            align="center"
            sx={{ fontSize: 30, fontWeight: 800 }}
          >
            xBorderPay
          </Typography>
          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="lightGrey"
            sx={{
              fontSize: { xs: 28, md: 32 },
              fontWeight: 600,
              mt: 4,
              fontFamily:
                "sharp-grotesk,inter,Helvetica,Roboto,Arial,sans-serif",
            }}
          >
            Welcome to the unbank
          </Typography>
          <LoginForm />
        </Paper>
      </Container>

      <Copyright/>
    </Box>
  );
}
