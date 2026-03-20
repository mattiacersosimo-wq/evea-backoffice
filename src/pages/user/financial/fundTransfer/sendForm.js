import { LoadingButton } from "@mui/lab";
import { Box, Grid, Typography } from "@mui/material";

import UsersSearch from "src/components/autoComplete/users";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import useFundForm from "./hooks/useFundForm";

const SendForm = ({ isFundTransfer, refetch }) => {
  const { methods, onSubmit } = useFundForm(refetch);

  const {
    formState: { isSubmitting },
  } = methods;

  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">
              <Translate>financial.fund_transfer.send.title</Translate>
            </Typography>
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <Box
                sx={{
                  display: "grid",
                  rowGap: 3,
                  columnGap: 2,
                  marginTop: 2,
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  },
                }}
              >
                <RHFSelect
                  name="wallet"
                  label="financial.fund_transfer.send.from"
                  size="small"
                >
                  <option />
                  <option value="ewallet">{t("global.e_wallet")}</option>
                  <option value="deposit_wallet">{t("global.d_wallet")}</option>
                </RHFSelect>
                <UsersSearch
                  isFundTransfer={isFundTransfer}
                  name="user_id"
                  props={{ size: "small" }}
                />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <RHFTextField
                  type="number"
                  name="amount"
                  label="global.amount"
                  size="small"
                  onWheel={(e) => e.target.blur()}
                />
              </Box>

              <Box
                sx={{
                  display: "grid",
                  rowGap: 3,
                  columnGap: 2,
                  marginTop: 2,
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(1, 1fr)",
                  },
                }}
              >
                <RHFTextField
                  multiline
                  fullWidth
                  rows={3}
                  name="note"
                  label="global.note"
                />
              </Box>
              <Box sx={{ display: "flex", mt: 2 }}>
                <LoadingButton
                  type="submit"
                  loading={isSubmitting}
                  variant="contained"
                  name="send"
                >
                  <Translate>global.send</Translate>
                </LoadingButton>
              </Box>
            </FormProvider>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SendForm;
