"use client";
import React from "react";
import XBPAppBar from "../components/appbar";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Box, Container, LinearProgress, Stack } from "@mui/material";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      redirect("/login");
    },
  });

  if (!session)
    return (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "90vh" }}
        >
          <Box sx={{ width: "20%" }}>
            <LinearProgress />
          </Box>
        </Stack>
    );

  return (
    <div>
      <XBPAppBar />
      {children}
    </div>
  );
}
