import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import { useGetCurrencySymbol } from "src/components/with-prefix";
import useErrors from "src/hooks/useErrors";

import fetchUser from "src/utils/fetchUser";
import { number, object } from "yup";

const genSchema = (limit) => {
  const schema = object().shape({
    amount: number()
      .typeError("errors.financial.pay_now.valid")
      .min(1, "errors.financial.pay_now.min")
      .max(limit, "errors.financial.pay_now.limit")
      .required("errors.financial.pay_now.required"),
  });

  return schema;
};

const PayNow = ({ balance }) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleErrors = useErrors();

  const methods = useForm({
    defaultValues: { amount: "" },
    resolver: yupResolver(genSchema(balance)),
  });

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    reqData.append("amount", inputData.amount);

    try {
      const { message, status } = await (
        await fetchUser.post("deposit-wallet", reqData)
      ).data;

      if (status) {
        enqueueSnackbar(message);
        methods.reset({ amount: "" });
      }
    } catch (err) {
      console.log(err);
      handleErrors(err);
    }
  };
  const {
    formState: { isSubmitting },
  } = methods;
  const symbol = useGetCurrencySymbol();
  const { t } = useTranslation();
  return (
    <>
      <Card sx={{ p: 3 }}>
        <FormProvider
          methods={methods}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Stack spacing={2} sx={{ maxWidth: "max-content" }}>
            <RHFTextField
              name="amount"
              label={t`${"user.online_store.product.amount"} (${symbol})`}
              size="small"
            />
            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              type="submit"
              name="add-credit"
            >
              <Translate>financial.deposit_wallet.pay_now.add</Translate>
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Card>
    </>
  );
};

export default PayNow;
