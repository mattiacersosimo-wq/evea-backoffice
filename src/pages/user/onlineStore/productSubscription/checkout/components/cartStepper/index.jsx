import { Grid, Step, StepLabel, Stepper } from "@mui/material";
import Connector from "./connector";
import StepIcon from "./stepIcon";

export const STEPS = ["Cart", "Payment"];

const CartStepper = ({ activeStep }) => {
  const isComplete = activeStep === STEPS.length;

  return (
    <Grid container justifyContent={isComplete ? "center" : "flex-start"}>
      <Grid item xs={12} md={8} sx={{ mb: 5 }}>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<Connector />}
        >
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={StepIcon}
                sx={{
                  "& .MuiStepLabel-label": {
                    typography: "subtitle2",
                    color: "text.disabled",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>
    </Grid>
  );
};

export default CartStepper;
