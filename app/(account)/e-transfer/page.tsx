"use client";
import { Container, Paper } from '@mui/material'
import React from 'react'
import TransactionCard from '../../components/transaction_card'
import Title from '../../components/title'
import VerticalLinearStepper from '../../components/stepper';

export default function ETransferPage() {
  return (
    <Container maxWidth="xl" sx={{ pt: 15, }}>
      <Paper
        sx={{
          bgcolor: "secondary.main",
          p: 2,
          px: 4,
          pb: 4,
          borderRadius: 3,
          overflow: "auto",
        }}
      >
        <Title title="Send e-Transfer" />
        <VerticalLinearStepper/>
      </Paper>
    </Container>
  )
}
