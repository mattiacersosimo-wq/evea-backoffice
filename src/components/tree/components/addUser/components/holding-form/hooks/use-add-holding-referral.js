import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";

const useAddHoldingReferral = (onSuccess = () => null) => {
    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async (inputData) => {
        const reqData = new FormData();

        Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));

        try {
            const { data } = await axiosInstance.post(
                "api/user/holding-to-binary",
                reqData
            );
            onSuccess();
            enqueueSnackbar(data.message);
        } catch (err) {
            enqueueSnackbar(err.message, { variant: "error" });
        }
    };

    return onSubmit;
};

export default useAddHoldingReferral;
