import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import useUpdateTemplate from "./hooks/use-update-template";

const DefaultTemplate = ({ open, onClose }) => {
  const { methods, onSubmit } = useUpdateTemplate({ open, onClose });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Default Template</DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12}>
              <RHFTextField label="Headline" name="headline" />
            </Grid>
            <Grid item md={6} sm={12}>
              <RHFTextField label="Subheading" name="Subheading" />
            </Grid>
            <Grid item md={6} sm={12}>
              <RHFTextField
                label="Features and benefits"
                name="features_and_benefits"
              />
            </Grid>
            <Grid item md={6} sm={12}>
              <RHFTextField
                label="Objection Handling"
                name="objection_handling"
              />
            </Grid>
            <Grid item md={6} sm={12}>
              <RHFTextField label="Social Proof" name="social_proof" />
            </Grid>
            <Grid item md={6} sm={12}>
              <input {...register("visuals")} type="file" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="error">
            cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            variant="contained"
          >
            submit
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default DefaultTemplate;
