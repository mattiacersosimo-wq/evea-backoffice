import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { useParams } from "react-router";
import Countries from "src/components/countries";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from "src/components/hook-form";
import useAuth from "src/hooks/useAuth";
import useErrors from "src/hooks/useErrors";

import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import SocialMedia from "src/sections/user/profile/EditInfo/components/SocialMedia";
import { defaultValues } from "src/sections/user/profile/EditInfo/hooks/useUserForm.js";
import axiosInstance from "src/utils/axios";
import { fData } from "src/utils/formatNumber";
import { useMemberProfileContext } from "../..";
import ShowOnlyForUser from "../show-only-for-user";
import useProfileEditForm from "./hooks/useProfileEditForm";
const genReqData = (inputData) => {
  const { social, ...rest } = inputData;
  const reqData = new FormData();
  Object.entries(rest).forEach(([key, value]) => reqData.append(key, value));
  Object.entries(social).forEach(([key, value]) =>
    reqData.append(key, value ? 1 : 0)
  );
  reqData.append("_method", "PUT");

  return reqData;
};

export default function EditInfo() {
  const { memberProfile, dispatch, fetchMemberProfile } =
    useMemberProfileContext();

  const { enqueueSnackbar } = useSnackbar();
  const { mid } = useParams();
  const handleErrors = useErrors();
  const methods = useProfileEditForm();
  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (inputData) => {
    try {
      const { status, data: responseData } = await axiosInstance.post(
        `api/user-profile-update/${mid}`,
        genReqData(inputData)
      );

      if (status === 200) {
        fetchMemberProfile();
        enqueueSnackbar(responseData.message);
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("profile_image", file);
    formData.append("_method", "PUT");

    try {
      const { status, data } = await axiosInstance({
        method: "post",
        url: `/api/admin-change-profile-image/${mid}`,
        data: formData,
      });

      if (status === 200) {
        methods.reset(defaultValues);
        fetchMemberProfile();
        enqueueSnackbar(data.message);
        dispatch({ type: "UPDATE_PROFILE_IMAGE", payload: data.data });
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        uploadImage(file);
      }
    },
    [setValue]
  );
  const onBlur = ({ target: { value, name } }) =>
    methods.setValue(name, value.trim());
  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                fileUrl={
                  memberProfile.user_profile?.user_profile?.profile_image
                }
                accept="image/png, image/jpg, image/jpeg, image/gif"
                maxSize={200000}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: "auto",
                      display: "block",
                      textAlign: "center",
                      color: "text.secondary",
                    }}
                  >
                    <Translate>{"profile.allowed"}</Translate> *.jpeg, *.jpg,
                    *.png, *.gif
                    <br /> <Translate>{"profile.max_size"}</Translate>{" "}
                    {fData(200000)}
                  </Typography>
                }
              />
            </Box>
            <ShowOnlyForUser>
              <SocialMedia />
            </ShowOnlyForUser>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: "grid",
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                },
              }}
            >
              <RHFTextField
                name="username"
                label={"profile.username"}
                onBlur={onBlur}
              />
              <RHFTextField name="first_name" label={"profile.first_name"} />
              <RHFTextField name="last_name" label={"profile.last_name"} />
              <RHFSelect name="gender" label={"profile.gender"}>
                <option value="" />
                <option value="male">{t("profile.male")}</option>
                <option value="female">{t("profile.female")}</option>
                <option value="other">{t("profile.other")}</option>
              </RHFSelect>
              <Countries />

              <RHFTextField name="state" label={"profile.state_region"} />
              <RHFTextField name="city" label={"profile.city"} />
              <RHFTextField name="zipcode" label={"profile.zip_codes"} />
              <RHFTextField name="address" label={"profile.address"} />
              <RHFTextField name="mobile" label={"profile.phone_numbers"} />
              <RHFTextField
                name="tax_code"
                label={"profile.tax_code"}
                disabled={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <RHFTextField
                name="vat_number"
                label={"profile.vat_number"}
                disabled={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <RHFTextField
                name="email"
                label={"profile.email_address"}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <ShowOnlyForUser>
                <RHFTextField name="facebook" label="Facebook" />
                <RHFTextField name="twitter" label="Twitter" />
                <RHFTextField name="whatsapp" label="WhatsApp" />
                <RHFTextField name="instagram" label="Instagram" />
                <RHFTextField name="telegram" label="Telegram" />
                <RHFTextField name="medium" label={"profile.medium"} />
              </ShowOnlyForUser>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                name="save-changes"
              >
                <Translate> {"profile.save_changes"}</Translate>
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
