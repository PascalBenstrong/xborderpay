"use client";
import { Container, Paper } from '@mui/material'
import React from 'react'
import TransactionCard from '../../components/transaction_card'
import Title from '../../components/title'
import VerticalLinearStepper from '../../components/stepper';

export default function ETransferPage() {
  return (
    <Container maxWidth="lg" sx={{ pt: 15, }}>
      <Paper
        sx={{
          bgcolor: "secondary.main",
          p: 2,
          px: 4,
          pb: 4,
          borderRadius: 3,
          height:"100%"
        }}
      >
        <Title title="Send e-Transfer" />
        <VerticalLinearStepper/>
      </Paper>
    </Container>
  )
}
