import { DialogContent } from "@material-ui/core";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import * as Yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import axiosInstance from "src/utils/axios";
import Transition from "src/utils/dialog-animation";

const schema = Yup.object().shape({
  reason: Yup.string().required("errors.sub_admin.reason.required"),
});

const DeleteDialog = ({ open, selectedId, onClose, fetchData }) => {
  const { palette } = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (inputData) => {
    const data = new FormData();
    data.append("_method", "DELETE");
    data.append("reason", inputData.reason);
    const { status, data: responseData } = await axiosInstance.post(
      `/api/admin/sub-admins/${selectedId}`,
      data
    );

    if (status === 200) {
      enqueueSnackbar(responseData.message);
      onClose();
      fetchData();
      return;
    }
    enqueueSnackbar("Failed to delete the video", { variant: "error" });
  };
  const { t } = useTranslation();

  const methods = useForm({
    defaultValues: {
      reason: "",
    },
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="delete-video"
      TransitionComponent={Transition}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle id="delete-video">
          <Translate> {"sub_admin.delete_sub_admin"} </Translate>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography>
              <Translate>{"holding_tank.are_you_sure"}</Translate>
            </Typography>
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
              <RHFTextField
                name="reason"
                variant="outlined"
                rows={3}
                fullWidth
                multiline
                label={t("sub_admin.reason")}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: palette.warning.normal }}>
            <Translate>{"sub_admin.cancel"}</Translate>
          </Button>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            variant="contained"
            color="error"
          >
            <Translate>{"sub_admin.delete"}</Translate>
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default DeleteDialog;
