import { LoadingButton } from "@mui/lab";
import { Button, DialogActions, DialogContent } from "@mui/material";
import { FormProvider } from "src/components/hook-form";
import ReferralUsers from "./components/referral-users";
import useAddHoldingReferral from "./hooks/use-add-holding-referral";
import useHoldingForm from "./hooks/use-holding-form";

const HoldingForm = ({ addUser, onClose, fetchTreeData }) => {
    const methods = useHoldingForm(addUser);

    const onSubmit = useAddHoldingReferral(() => {
        onClose();
        fetchTreeData();
    });
    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
                <ReferralUsers />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} autoFocus name="close" color="error">
                    Close
                </Button>
                <LoadingButton
                    loading={isSubmitting}
                    type="submit"
                    variant="contained"
                    name="add-user"
                >
                    Submit
                </LoadingButton>
            </DialogActions>
        </FormProvider>
    );
};

export default HoldingForm;
