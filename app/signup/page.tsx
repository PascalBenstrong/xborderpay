"use client";
import * as React from "react";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import { Unstable_Grid2 as Grid, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
//import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FormControl, InputLabel } from "@mui/material";
//import BootstrapInput from "../../../components/BootstrapInput";
import router from "next/router";
import { LoginForm } from "./form";
import Copyright from "@/components/copyrightFooter";

//import "../../../styles/scss/theme/_loginFooter.scss";



const theme = createTheme({
  palette: {
    background: {
      //default: "#e7edeb",
      default: "#fafafa",
    },
    primary: {
      main: "#00383d",
    },
    secondary: {
      main: "#ff0038",
    },
    text: {
      primary: "#000",
      secondary: "#018567",
    },
  },
});

export default async function SignUp() {
  return (
    <Box className="login-page">
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          minHeight: { xs: "80vh", sm: "80vh" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: 0, sm: 5 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#00000080",
            marginTop: { sm: 5 },
            elevation: { xs: 0 },
            padding: 5,
            paddingTop: { xs: 8, sm: 3 },
            height: { xs: "100%", sm: "100%" },
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
            Create an Account
          </Typography>
          <LoginForm />
        </Paper>
      </Container>

      <Copyright/>
    </Box>
  );
}
