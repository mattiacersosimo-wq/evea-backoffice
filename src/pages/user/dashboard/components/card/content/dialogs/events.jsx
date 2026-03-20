import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { CustomDialog, useDialogContext } from "src/components/customDialog";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import RHFTimePicker from "src/components/hook-form/RHFTimePicker";
import useEventsForm from "./hooks/useEventsForm";

const EventsDialog = ({ name }) => {
  const { open } = useDialogContext();
  const { methods, onSubmit } = useEventsForm();
  return (
    <CustomDialog name={name}>
      <DialogTitle>Add Event</DialogTitle>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogContent
          sx={{
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <DialogContentText>
            <Box
              sx={{
                marginTop: "1rem",
                marginBottom: "1rem",

                display: "grid",
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                },
              }}
            >
              <RHFTextField name="name" label="Event Name" />
              <RHFTextField name="host" label="Hosted by" />
              <RHFDatePicker name="date" label="Date" />
              <RHFTimePicker name="time" label="Time" />
              <RHFTextField name="duration" label="Duration" />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            type="submit"
            loading={methods.formState.isSubmitting}
            variant="outlined"
          >
            Add
          </LoadingButton>
          <Button onClick={() => open("")} color="error">
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </CustomDialog>
  );
};

export default EventsDialog;
