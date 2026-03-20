import { LoadingButton } from "@mui/lab";
import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useSnackbar } from "notistack";
import { useEffect } from "react";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import axiosInstance from "src/utils/axios";
import useGetSubscriptionById from "./hooks/use-get-subscription-by-id";
import useSubScriptionCategories from "./hooks/use-subscription-categories";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const EditDialog = ({ open, selectedId, onClose, fetchData }) => {
  const theme = useTheme();
  const { methods, fetchSubScriptionById } = useGetSubscriptionById();
  const { enqueueSnackbar } = useSnackbar();
  const categoryList = useSubScriptionCategories(open);

  useEffect(() => {
    if (open) fetchSubScriptionById(selectedId);
  }, [open]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (inputData) => {
    const formData = new FormData();

    Object.entries(inputData).forEach(([key, value]) =>
      formData.append(key, value)
    );
    formData.append("_method", "PUT");

    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/product-subscriptions/${selectedId}`,
        formData
      );
      if (status === 200) {
        fetchData();
        onClose();
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      Object.values(err).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="edit-products"
      TransitionComponent={Transition}
    >
      <DialogTitle id="edit-products">
        <Translate>{"assign_subscriptions.editSubscription"}</Translate>
      </DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                marginTop: 3,
                gridTemplateColumns: "repeat(1, 1fr)",
              }}
            >
              <RHFTextField
                name="note"
                label={"assign_subscriptions.note"}
                multiline
                fullWidth
                rows={3}
              />
              <RHFSelect
                name="category_id"
                label={"assign_subscriptions.category"}
              >
                <option value="" />
                {categoryList}
              </RHFSelect>
              <RHFDatePicker
                name="date"
                label={"assign_subscriptions.certifiedDate"}
              />

              <RHFDatePicker
                name="effective_until"
                label={"assign_subscriptions.effectiveUntil"}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} autoFocus color="error" name="close">
            {"assign_subscriptions.close"}
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            name="submit"
          >
            {"assign_subscriptions.update"}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default EditDialog;
