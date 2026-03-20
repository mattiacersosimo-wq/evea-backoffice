import { LoadingButton } from "@mui/lab";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import { formats } from "src/components/editor/EditorToolbar";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import axiosInstance from "src/utils/axios";
import useUpdateForm from "./hooks/use-update-form";

const UpdateBankDetails = ({ open, onClose }) => {
    const methods = useUpdateForm(open);
    const {
        handleSubmit,
        formState: { isSubmitting },
        setValue,
        watch,
    } = methods;

    const details = watch("details");
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async (inputData) => {
        const reqData = new FormData();
        reqData.append("details", inputData.details);
        try {
            const { data } = await axiosInstance.post(
                "/api/admin/bank-account-details/",
                reqData
            );

            enqueueSnackbar(data.message);
            onClose();
        } catch (err) {
            enqueueSnackbar(err.message, { variant: "error" });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>
                <Typography variant="h5" color="text.primary">
                    <Translate>profile.settings.bank.title</Translate>
                </Typography>
            </DialogTitle>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Box
                        sx={{
                            width: "100%",
                            borderRadius: "10px",
                            border: "1px solid",
                            height: "250px",
                            overflow: "scroll",
                        }}
                    >
                        <ReactQuill
                            value={details}
                            onChange={(v) => {
                                setValue("details", v);
                            }}
                            modules={{
                                toolbar: null,
                            }}
                            theme="bubble"
                            placeholder={t(
                                "settings.advanced_settings.payment.editor"
                            )}
                            id="details"
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} variant="outlined" color="error">
                        <Translate>global.close</Translate>
                    </Button>
                    <LoadingButton
                        variant="contained"
                        type="submit"
                        loading={isSubmitting}
                    >
                        <Translate>profile.settings.bank.save</Translate>
                    </LoadingButton>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
};

export default UpdateBankDetails;
