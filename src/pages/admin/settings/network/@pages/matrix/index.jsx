import { LoadingButton } from "@mui/lab";
import { Box, Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import axiosInstance from "src/utils/axios";
import useMatrixForm from "./hooks/use-matrix-from";

const DataTable = () => {
  const methods = useMatrixForm();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    reqData.append("_method", "PUT");
    Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));
    try {
      const { data } = await axiosInstance.post(
        "api/admin/matrix-settings",
        reqData
      );
      enqueueSnackbar(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <>
      <Box>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item md={4}>
              <RHFTextField size="small" label="Width" name="width" />
            </Grid>
            <Grid item md={4}>
              <RHFTextField size="small" label="Height" name="height" />
            </Grid>

            <Grid item md={4}>
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
              >
                update
              </LoadingButton>
            </Grid>
          </Grid>
        </FormProvider>
      </Box>
    </>
  );
};

export default DataTable;
