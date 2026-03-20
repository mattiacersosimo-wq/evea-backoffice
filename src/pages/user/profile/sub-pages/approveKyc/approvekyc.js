import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  Stack,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { FormProvider } from "src/components/hook-form";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useAuth from "src/hooks/useAuth";
import * as Yup from "yup";
import useAddKyc from "./useAddKyc";
import { useTranslation } from "react-i18next";
import Message from "./message";
import Attachments from "src/components/Attachments";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
const Approvekyc = () => {
  const { user } = useAuth();
  const { id } = user;
  const { methods, onSubmit } = useAddKyc(id);
  const {
    formState: { errors, isSubmitting },
  } = methods;

  const isKycPending = user?.user_profile?.kyc_status;
  const { t } = useTranslation();
  const KycPending = () => {
    switch (isKycPending) {
      case "pending":
        return <Message severity="warning" title={t("global.kyc_pending")} />;
      case "rejected":
        return (
          <>
            <Message
              isReject
              severity="error"
              title={`${user?.user_profile?.kyc_reject_reason}`}
            />
          </>
        );
      case "approved":
        return <Message severity="success" title={t("global.kyc_approved")} />;
      default:
        return null;
    }
  };

  return (
    <div id="approvekyc">
      <Card sx={{ p: 3, mt: 1 }}>
        <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
          <Translate>global.kyc_details</Translate>
        </Typography>
        <Box
          sx={{
            display: "grid",
            columnGap: 1,
            rowGap: 3,
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            },
          }}
        >
          <Ternary
            when={user?.user_profile?.kyc_identity_proof}
            then={
              <Attachments
                mail={user?.user_profile?.kyc_identity_proof}
                label={t("global.Identity_proof")}
              />
            }
          />
          <Ternary
            when={user?.user_profile?.kyc_address_proof}
            then={
              <Attachments
                mail={user?.user_profile?.kyc_address_proof}
                label={t("global.proof_of_address")}
              />
            }
          />
        </Box>

        <Box sx={{ flexGrow: 1, marginTop: 3 }}>
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Ternary
              when={isKycPending === "rejected" || isKycPending === null}
              then={
                <>
                  <Grid
                    container
                    spacing={{ xs: 1, md: 3 }}
                    columns={{ xs: 1, sm: 8, md: 12 }}
                  >
                    <Grid item xs={2} sm={4} md={6}>
                      <TextField
                        type="file"
                        label={t("global.Identity_proof")}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        {...methods.register("kyc_identity_proof", {
                          required: t("Document"),
                        })}
                        error={Boolean(errors.kyc_identity_proof)}
                        helperText={errors.kyc_identity_proof?.message}
                      />
                    </Grid>
                    <Grid item xs={2} sm={4} md={6}>
                      <TextField
                        type="file"
                        label={t("global.proof_of_address")}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        {...methods.register("kyc_address_proof", {
                          required: t("Document"),
                        })}
                        error={Boolean(errors.kyc_address_proof)}
                        helperText={errors.kyc_address_proof?.message}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography textAlign="right">
                      <LoadingButton
                        variant="contained"
                        type="submit"
                        loading={isSubmitting}
                      >
                        {t("global.upload")}
                      </LoadingButton>
                    </Typography>
                  </Grid>
                </>
              }
            />
            <Grid container spacing={2} mt={1}>
              <Grid item xs={6} sx={{ display: "flex" }}>
                <KycPending />
              </Grid>
            </Grid>
          </FormProvider>
        </Box>
      </Card>
    </div>
  );
};
export default Approvekyc;
