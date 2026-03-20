import { Box, Stack, Typography } from "@mui/material";
import { RHFRadioGroup } from "src/components/hook-form";

const Method = () => {
  return (
    <Box>
      <Stack spacing={1}>
        <Typography variant="h5" fontWeight="bold">
          {"userBusinessBuilder.subscription.paymentMethod"}
        </Typography>
        <RHFRadioGroup name="method" options={["Coin Payment", "Card"]} />
      </Stack>
    </Box>
  );
};

export default Method;
