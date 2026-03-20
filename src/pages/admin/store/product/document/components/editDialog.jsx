import { yupResolver } from "@hookform/resolvers/yup";
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
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { FormProvider } from "src/components/hook-form";
import Translate from "src/components/translate";

import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";
import * as Yup from "yup";

const EditDialog = ({ editId, onClose }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const { pid } = useParams();

  const ChangePassWordSchema = Yup.object().shape({
    doc: Yup.mixed().test(
      "isFile",
      "errors.product_document.sample_doc.required",
      (value) => Boolean(value?.length)
    ),
  });

  const defaultValues = {
    doc: "",
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data) => {
    const reqData = new FormData();
    reqData.append("_method", "PUT");
    reqData.append("product_id", pid);
    reqData.append("doc", data.doc[0]);

    const URL = `/api/admin/product-docs/${editId}`;

    try {
      const { status, data } = await axiosInstance.post(URL, reqData);
      if (status === 200) {
        navigate(PATH_DASHBOARD.store.products);
        enqueueSnackbar(data.message);
        onClose();
        reset();
        return;
      }
      enqueueSnackbar(data.message);
    } catch (err) {
      console.error(err);
    }
  };
  const { t } = useTranslation();
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={Boolean(editId)}
      onClose={onClose}
      aria-labelledby="edit-document"
      TransitionComponent={Transition}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle id="edit-document">
          <Translate>{"products.document.edit_document"}</Translate>
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
                name="doc"
                type="file"
                label={t("products.document.uploadDocument")}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ accept: ".xlsx, .xls, .pdf" }}
                {...methods.register("doc")}
                error={Boolean(errors.doc)}
                helperText={t(errors.doc?.message)}
              />
            </Box>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} autoFocus color="error" name="close">
            <Translate>{"products.document.close"}</Translate>
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            name="update"
          >
            <Translate> {"products.document.update"}</Translate>
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default EditDialog;
