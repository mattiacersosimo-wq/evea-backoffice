import { Box, Card, Typography } from "@mui/material";

import { LoadingButton } from "@mui/lab";
import UsersSearch from "src/components/autoComplete/users";
import DepositWalletAmountType from "src/components/deposit-wallet-amount-type";
import { FormProvider } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import Translate from "src/components/translate";

const FilterCard = ({ fetchData, methods }) => {
  const onSubmit = async (inputData) => {
    await fetchData(inputData);
  };
  const {
    formState: { isSubmitting },
  } = methods;

  return (
    <div>
      <Card sx={{ p: 3 }}>
        <Box>
          <Typography variant="subtitle2">
            <Translate>financial.deposit_wallet.history</Translate>
          </Typography>
          <FormProvider
            methods={methods}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                marginTop: 3,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(4, 1fr)",
                },
              }}
            >
              <RHFDatePicker
                name="start_date"
                label="date.start"
                size="small"
              />

              <RHFDatePicker name="end_date" label="date.end" size="small" />

              <UsersSearch name="from_id" props={{ size: "small" }} />
              <DepositWalletAmountType />
            </Box>
            <Box mt={2} sx={{ float: "right" }}>
              <LoadingButton
                loading={isSubmitting}
                type="submit"
                variant="contained"
                name="get-report"
              >
                <Translate>report.get</Translate>
              </LoadingButton>
            </Box>
          </FormProvider>
        </Box>
      </Card>
    </div>
  );
};

export default FilterCard;
