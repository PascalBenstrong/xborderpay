"use client";
import React from 'react'
import XBPAppBar from '../components/appbar';

export default function AccountLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <div>
        <XBPAppBar/>
        {children}
    </div>
  )
}
