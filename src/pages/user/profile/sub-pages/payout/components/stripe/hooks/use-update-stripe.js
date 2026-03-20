import { useSnackbar } from "notistack";
import useAuth from "src/hooks/useAuth";
import axiosInstance from "src/utils/axios";
import useGetUserStripeInfo from "./use-get-user-stripe-info";

const useUpdateStripe = () => {
    const methods = useGetUserStripeInfo();
    const { getUser } = useAuth();

    const { setError } = methods;
    const { enqueueSnackbar } = useSnackbar();
    const onSubmit = async (inputData) => {
        const reqData = new FormData();
        reqData.append("_method", "PUT");
        Object.entries(inputData).forEach(([k, v]) => reqData.append(k, v));

        try {
            const { data } = await axiosInstance.post(
                "api/user/stripe-update",
                reqData
            );
            enqueueSnackbar(data.message);
            await getUser();
        } catch (err) {
            if (err.errors) {
                Object.entries(err.errors).forEach(([k, v]) => {
                    setError(k, { message: v.find(Boolean) });
                });
            }
            enqueueSnackbar(err.message, { variant: "error" });
        }
    };

    return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useUpdateStripe;
