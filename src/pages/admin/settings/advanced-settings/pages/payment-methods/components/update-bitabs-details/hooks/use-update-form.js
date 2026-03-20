import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "src/utils/axios";

const defaultValues = {
    wallet_address: "",
};

const useUpdateForm = (open) => {
    const methods = useForm({ defaultValues });
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosInstance.get(
                    "/api/admin/bank-account-details/"
                );
                methods.setValue("wallet_address", data.data);
            } catch (err) {
                enqueueSnackbar(err.message);
            }
        };
        if (open) {
            fetchData();
        }
    }, [open]);

    return methods;
};

export default useUpdateForm;
