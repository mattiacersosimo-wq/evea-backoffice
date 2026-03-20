import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import axiosInstance from "src/utils/axios";

const useFetchCoin = () => {
    const [coinTypes, setCoinTypes] = useState([]);
    const { setValue } = useFormContext();
    const { enqueueSnackbar } = useSnackbar();
    const fetchData = async () => {
        try {
            const { status, data } = await axiosInstance.get(
                `/api/availablecoins`
            );
            if (status) {
                setCoinTypes(data.data);
            }
        } catch (err) {
            Object.values(err?.errors).flatMap((item) =>
                enqueueSnackbar(item, { variant: "error" })
            );
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return coinTypes;
};

export default useFetchCoin;
