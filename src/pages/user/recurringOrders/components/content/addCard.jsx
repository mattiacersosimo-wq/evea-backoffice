import { LoadingButton } from "@mui/lab";
import { Button, DialogActions, DialogContent } from "@mui/material";
import CardInfo from "src/components/finpayForm/components/cardInfo";
import PersonalInfo from "src/components/finpayForm/components/personalInfo";
import { FormProvider } from "src/components/hook-form";
import Translate from "src/components/translate";
import useCardForm from "./hooks/useCardForm";

const AddCard = ({ onClose, productId, purchaseId, reload }) => {
  const { methods, onSubmit } = useCardForm(
    productId,
    purchaseId,
    onClose,
    reload
  );
  const {
    formState: { isSubmitting },
  } = methods;
  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <DialogContent>
        <PersonalInfo />
        <CardInfo />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          autoFocus
          variant="outlined"
          color="warning"
          name="close"
        >
          <Translate>global.cancel</Translate>
        </Button>
        <LoadingButton
          loading={isSubmitting}
          type="submit"
          variant="contained"
          autoFocus
          disableElevation
          name="enable"
        >
          <Translate>user.subscriptions.recurring_payment</Translate>
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export default AddCard;
