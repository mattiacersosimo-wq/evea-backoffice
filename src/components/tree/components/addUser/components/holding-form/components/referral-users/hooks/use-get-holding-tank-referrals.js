import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useGetHoldingTankReferrals = () => {
    const [users, setUsers] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosInstance.get(
                    "api/user/binary-holding-users"
                );

                setUsers(data.data);
            } catch (err) {
                enqueueSnackbar(err.message, { variant: "error" });
                console.log(err);
            }
        };
        fetchData();
    }, []);

    return users;
};

export default useGetHoldingTankReferrals;
