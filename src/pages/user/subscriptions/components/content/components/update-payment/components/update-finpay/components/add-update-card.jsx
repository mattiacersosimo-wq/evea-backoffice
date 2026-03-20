import { LoadingButton } from "@mui/lab";
import { Box, Button, DialogActions, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import useUpdateCardForm from "../hooks/use-update-card-form";

const AddUpdateCard = ({ onClose, purchaseId, fetchData }) => {
  const { palette } = useTheme();
  const { methods, onSubmit } = useUpdateCardForm(purchaseId, () => {
    onClose();
    fetchData();
  });
  const {
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 600, fontSize: "12px", color: "#637381", mb: 4 }}
      >
        Note: Accept Visa & Mastercard Only
      </Typography>
      <div>
        <Box
          sx={{
            display: "grid",
            rowGap: 3,
            columnGap: 2,
            marginTop: 1,
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            },
          }}
        >
          <RHFTextField name="payment_cardname" label="Payment Card Name" />
          <RHFTextField name="payment_cardnumber" label="Payment Card Number" />
          <RHFTextField
            name="payment_cardexpiry"
            label="Payment Card Expiry - MMYY"
          />
          <RHFTextField name="paymentcard_csc" label="PaymentCardCSC/CVN" />
        </Box>
      </div>

      <Divider sx={{ borderStyle: "dashed" }} />
      <DialogActions>
        <LoadingButton
          loading={isSubmitting}
          type="submit"
          variant="contained"
          autoFocus
          disableElevation
        >
          update now
        </LoadingButton>
        <Button
          onClick={onClose}
          autoFocus
          sx={{ color: palette.warning.normal }}
        >
          Close
        </Button>
      </DialogActions>
    </FormProvider>
  );
};

export default AddUpdateCard;
