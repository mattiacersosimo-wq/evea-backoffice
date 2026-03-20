import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as Yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router";
import { FormProvider } from "src/components/hook-form";

import axiosInstance from "src/utils/axios";
import Translate from "src/components/translate";
import { useTranslation } from "react-i18next";
import Transition from "src/utils/dialog-animation";

const sampleSchema = Yup.object().shape({
  sample_doc: Yup.mixed().test(
    "isFile",
    "errors.product_document.sample_doc.required",
    (value) => Boolean(value?.length)
  ),
});

const schema = Yup.object().shape({
  doc: Yup.mixed().test(
    "isFile",
    "errors.product_document.doc.required",
    (value) => Boolean(value?.length)
  ),
});

const AddDialog = ({
  open,
  onClose,
  fetchDocs,
  name,
  isSampleDocs = false,
}) => {
  const { pid } = useParams();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    resolver: yupResolver(isSampleDocs ? sampleSchema : schema),
  });
  const {
    formState: { isSubmitting, errors },
  } = methods;
  const onSubmit = async (inputData) => {
    const reqData = new FormData();

    reqData.append(name, inputData[name][0]);
    reqData.append("product_id", pid);

    const URL = isSampleDocs
      ? "/api/admin/product-sample-docs"
      : "/api/admin/product-docs";

    try {
      const { status, data } = await axiosInstance.post(URL, reqData);
      if (status === 200) {
        fetchDocs();
        enqueueSnackbar(data.message);
        onClose();
        return;
      }
      enqueueSnackbar(data.message);
    } catch (err) {
      enqueueSnackbar("Failed to upload doc", { variant: "error" });
    }
  };
  const { t } = useTranslation();
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="add-document"
      TransitionComponent={Transition}
    >
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <DialogTitle id="add-document">
          <Translate>{"products.document.add_sample_document"}</Translate>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                marginTop: 3,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                },
              }}
            >
              <TextField
                type="file"
                label={t("products.document.uploadDocument")}
                {...methods.register(name)}
                inputProps={{
                  accept: ".xlsx, .xls, .pdf",
                }}
                error={Boolean(errors[name])}
                helperText={errors[name]?.message}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            autoFocus
            color="error"
            variant="outlined"
            name="cancel"
          >
            <Translate> {"products.document.cancel"}</Translate>
          </Button>

          <LoadingButton
            loading={isSubmitting}
            type="submit"
            variant="contained"
            name="upload"
          >
            <Translate> {"products.document.upload"}</Translate>
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default AddDialog;
