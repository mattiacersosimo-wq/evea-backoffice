import { yupResolver } from "@hookform/resolvers/yup";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import axiosInstance from "src/utils/axios";
import { object, string } from "yup";

const defaultValues = {
    wallet_address: "",
};

const schema = object().shape({
    wallet_address: string().required("Wallet Address is required"),
});

const UpdateBitabsDetails = ({ open, onClose, details, getData }) => {
    const methods = useForm({ defaultValues, resolver: yupResolver(schema) });

    const {
        handleSubmit,
        formState: { isSubmitting },
        setValue,
    } = methods;
    const { id, wallet_address } = details || {};

    useEffect(() => {
        if (wallet_address) {
            setValue("wallet_address", wallet_address);
        }
    }, [wallet_address]);

    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async (inputData) => {
        const reqData = new FormData();
        reqData.append("wallet_address", inputData.wallet_address);
        reqData.append("_method", "PUT");
        try {
            const { data } = await axiosInstance.post(
                `api/admin/update-wallet-address/${id}`,
                reqData
            );
            getData();
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
                    <Translate>profile.settings.bitaps.title</Translate>
                </Typography>
            </DialogTitle>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Box sx={{ width: "100%" }}>
                        <RHFTextField
                            name="wallet_address"
                            label="Wallet Address"
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

export default UpdateBitabsDetails;
