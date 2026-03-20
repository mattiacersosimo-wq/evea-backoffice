import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useMethods from "../../form-dialog/hooks/use-methods";

const useAdd = (onSuccess) => {
    const methods = useMethods();
    const { enqueueSnackbar } = useSnackbar();
    const onSubmit = async ({ input_options, ...inputData }) => {
        const reqData = new FormData();
        Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));
        if (input_options?.length > 0) {
            reqData.append("input_options", JSON.stringify(input_options));
        }
        try {
            const { data } = await axiosInstance.post(
                "api/admin/registration-settings",
                reqData
            );
            onSuccess();
            enqueueSnackbar(data.message);
            methods.reset();
        } catch (err) {
            enqueueSnackbar(err.message, { variant: "error" });
            if (err.errors) {
                Object.entries(err.errors).forEach(([k, v]) =>
                    methods.setError(k, { message: v })
                );
            }
        }
    };

    return { methods, onSubmit };
};

export default useAdd;
