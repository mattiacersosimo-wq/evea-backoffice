import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Typography } from "@mui/material";
import React from "react";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import useUpdateBank from "./hooks/use-update-bank";

const BankAccount = () => {
  const { methods, onSubmit } = useUpdateBank();

  return (
    <Card sx={{ p: 3, mt: 1 }}>
      <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
        <Translate>profile.settings.bank_account.title</Translate>
      </Typography>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item md={6}>
            <RHFTextField name="bank_name" label="Bank name" />
          </Grid>
          <Grid item md={6}>
            <RHFTextField name="bank_country" label="Bank country" />
          </Grid>
          <Grid item md={6}>
            <RHFTextField name="swift" label="SWIFT" />
          </Grid>
          <Grid item md={6}>
            <RHFTextField name="iban" label="IBAN" />
          </Grid>
        </Grid>

        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <LoadingButton
            type="submit"
            loading={methods.formState.isSubmitting}
            variant="contained"
          >
            save changes
          </LoadingButton>
        </Box>
      </FormProvider>
    </Card>
  );
};

export default BankAccount;
