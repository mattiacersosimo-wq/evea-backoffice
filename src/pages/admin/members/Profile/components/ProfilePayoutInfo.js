import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Card, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { FormProvider, RHFTextField } from "src/components/hook-form";

import axiosInstance from "src/utils/axios";
import * as Yup from "yup";
import { useMemberProfileContext } from "..";

const ProfilePayoutInfo = () => {
  const { mid } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { memberProfile } = useMemberProfileContext();
  const { payout_wallet } = memberProfile.user_profile?.user_profile || {};

  const Validator = Yup.object().shape({
    payout_wallet: Yup.string()
      .min(26, "Minimum length should be 26 characters")
      .max(35, "Maximum length should be 35 characters")
      .required("New Password is required"),
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
        url: `/api/user-profile-payout-wallet/${mid}`,
        data: data,
      });
      if (status === 200) {
        reset();
        enqueueSnackbar(resData.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Card sx={{ p: 3, mt: 1 }}>
        <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
          {"profile.payoutBtcWallet"}
        </Typography>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} alignItems="flex-end">
            <RHFTextField name="payout_wallet" label={"profile.btcWallet"} />
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              {"profile.save"}
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Card>
    </div>
  );
};

export default ProfilePayoutInfo;
