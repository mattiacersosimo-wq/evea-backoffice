import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Typography } from "@mui/material";
import React from "react";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import { useWatch } from "react-hook-form";
import Translate from "src/components/translate";
import useUpdateBank from "./hooks/use-update-bank";

const BankAccount = () => {
  const { methods, onSubmit } = useUpdateBank();
  const iban = useWatch({ control: methods.control, name: "iban" });
  const isItalian = !iban || iban.toUpperCase().startsWith("IT");

  return (
    <Card sx={{ p: 3, mt: 1 }}>
      <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
        <Translate>profile.settings.bank_account.title</Translate>
      </Typography>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={isItalian ? 12 : 6}>
            <RHFTextField name="iban" label="IBAN" placeholder="IT60X0542811101000000123456" />
          </Grid>
          {!isItalian && (
            <Grid item xs={12} md={6}>
              <RHFTextField name="swift" label="BIC / SWIFT" />
            </Grid>
          )}
        </Grid>

        {isItalian && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Per IBAN italiano il BIC/SWIFT non serve.
          </Typography>
        )}

        <Box sx={{ marginTop: 3, display: "flex", justifyContent: "flex-end" }}>
          <LoadingButton
            type="submit"
            loading={methods.formState.isSubmitting}
            variant="contained"
          >
            Salva
          </LoadingButton>
        </Box>
      </FormProvider>
    </Card>
  );
};

export default BankAccount;
