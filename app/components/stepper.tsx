import * as React from "react";
import { Box, Unstable_Grid2 as Grid } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ETransferSuccess from "./e-transfer/success";
import SelectAccountPayee from "./e-transfer/selectPayee";

const steps = [
  {
    label: "Account & Payee",
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: "Amount",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Preview",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Successful",
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid xs={12} lg={2}>
          <Stepper activeStep={activeStep} orientation="vertical" sx={{display: {xs: "none", lg: "flex"}}}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Stepper activeStep={activeStep} orientation="horizontal" sx={{display: {xs: "flex", lg: "none"}, mb: 3}}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid xs={12} md={12} lg={10}>
          {activeStep == 0 && <SelectAccountPayee />}
          {activeStep <= steps.length - 2 && (
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{ mt: 1, mr: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ mt: 1, mr: 1 }}
              >
                {activeStep === steps.length - 2 ? "Send Money" : "NEXT"}
              </Button>
            </Box>
          )}
          {activeStep === steps.length - 1 && <ETransferSuccess />}
        </Grid>
      </Grid>
    </Box>
  );
}
