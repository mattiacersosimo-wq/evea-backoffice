import { DialogContent } from "@material-ui/core";
import { Button, Dialog, DialogTitle, Stack, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import Translate from "src/components/translate";
import { FormProvider } from "src/components/hook-form";

const EditDialogProof = ({ title, open, selectedId, onClose, fetchData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const ReviewSchema = Yup.object().shape({
    kyc_address_proof: Yup.mixed().test(
      "isFile",
      "Kyc address proof is required",
      (value) => Boolean(value.length)
    ),
  });

  const defaultValues = {
    kyc_address_proof: "",
  };

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const { t } = useTranslation();
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    reqData.append("user_id", selectedId);
    reqData.append("kyc_address_proof", inputData.kyc_address_proof[0]);
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin-kyc-details-address`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        fetchData();
        onClose();
        methods.reset();
      }
    } catch (error) {
      Object.entries(error.errors).forEach(([k, v]) =>
        setError(k, { message: v[0] })
      );
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-blog"
      TransitionComponent={Transition}
    >
      <DialogTitle id="delete-blog">KYC {title} </DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack sx={{ p: 3 }}>
            <TextField
              type="file"
              label={t("global.Identity_proof")}
              inputProps={{ accept: ".pdf,.png,.jpg,.jpeg" }}
              InputLabelProps={{
                shrink: true,
              }}
              {...methods.register("kyc_address_proof", {
                required: t("Document"),
              })}
              error={Boolean(errors.kyc_address_proof)}
              helperText={errors.kyc_address_proof?.message}
            />
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1.5}
              marginTop={3}
            >
              <Button
                variant="contained"
                color="error"
                onClick={onClose}
                name="cancel"
              >
                <Translate>tools.videos.close</Translate>
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                name="review"
              >
                <Translate>blogs.create.form.submit</Translate>
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialogProof;
