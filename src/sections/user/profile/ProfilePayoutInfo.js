import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Card, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import useAuth from "src/hooks/useAuth";
import useErrors from "src/hooks/useErrors";

import axiosInstance from "src/utils/axios";
import * as Yup from "yup";

const ProfilePayoutInfo = () => {
  const handleErrors = useErrors();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { payout_wallet } = user?.user_profile || {};

  const Validator = Yup.object().shape({
    payout_wallet: Yup.string()
      .min(26, "Minimum length should be 26 characters")
      .max(35, "Maximum length should be 35 characters")
      .typeError("Wallet id is required")
      .required("Wallet id is required"),
  });
  const defaultValues = {
    payout_wallet: payout_wallet,
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(Validator),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (reqdata) => {
    let data = new FormData();
    data.append("payout_wallet", reqdata.payout_wallet);
    data.append("_method", "PUT");
    try {
      const { status, data: resData } = await axiosInstance({
        method: "post",
        url: "/api/profile-payout-wallet",
        data: data,
      });
      if (status === 200) {
        reset();
        enqueueSnackbar(resData.message);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    reset({ payout_wallet });
  }, [payout_wallet]);

  return (
    <div>
      <Card sx={{ p: 3, mt: 1 }}>
        <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
          <Translate>{"settings.reports.walletAddress"}</Translate>
        </Typography>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} alignItems="flex-end">
            <RHFTextField
              InputLabelProps={{ shrink: true }}
              name="payout_wallet"
              label={"settings.reports.walletAddress"}
            />
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              name="payout-wallet"
            >
              <Translate> {"profile.save_changes"}</Translate>
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Card>
    </div>
  );
};

export default ProfilePayoutInfo;
