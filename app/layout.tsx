"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

const themeLight = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f8f9fb",
    },
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#00383d",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      //light: "#f5ee84",
      main: "#fff",
      //dark: "#460370",
      // dark: will be calculated from palette.secondary.main,
      //contrastText: "#ffcc00",
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
    text: {
      primary: "#000",
      secondary: "#0ca581",
    },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

const themeDark = createTheme({
  palette: {
    //mode: "dark",
    background: {
      default: "#0d1116",
    },
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#0ca581",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      //light: "#f5ee84",
      main: "#161c23",
      //dark: "#460370",
      // dark: will be calculated from palette.secondary.main,
      //contrastText: "#ffcc00",
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
    text: {
      primary: "#fff",
      secondary: "#0ca581",
    },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={themeDark}>
          <CssBaseline />

          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
