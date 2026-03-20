import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useSnackbar } from "notistack";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

import { USER_ROUTES } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import useGetGuidanceById from "./hooks/useGetGuidanceById";
import Translate from "src/components/translate";

const EditForm = ({ selectedGuidanceId, handleClose, fetchData }) => {
  const methods = useGetGuidanceById(selectedGuidanceId);
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    [...Object.entries(inputData)].forEach(([key, value]) =>
      reqData.append(key, value)
    );
    reqData.append("_method", "PUT");
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/brand-user-guidances/${selectedGuidanceId}`,
        reqData
      );
      if (status === 200) {
        fetchData();
        enqueueSnackbar(data.message);
        handleClose();
      }
    } catch (err) {}
  };
  const url = methods.getValues("url");
  const uniqueList = [...new Set([url, ...USER_ROUTES])];
  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
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
            <RHFSelect name="url" label="URL">
              {uniqueList.map((url) => (
                <option value={url}>{url}</option>
              ))}
            </RHFSelect>
            <RHFTextField
              name="title"
              type="text"
              label={"settings.brand.blogTitle"}
            />
            <RHFTextField
              type="text"
              label={"settings.brand.description"}
              multiline
              fullWidth
              rows={4}
              name="description"
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus color="error" name="close">
          <Translate> {"settings.brand.close"}</Translate>
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={methods.formState.isSubmitting}
          name="submit"
        >
          <Translate>{"settings.brand.update"}</Translate>
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export default EditForm;
