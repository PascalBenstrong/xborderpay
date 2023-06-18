"use client";
import React from "react";
import XBPAppBar from "../components/appbar";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      redirect("/login")
    },
  });

  if (!session) return null;

  return (
    <div>
      <XBPAppBar />
      {children}
    </div>
  );
}
