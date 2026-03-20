import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuth from "src/hooks/useAuth";
import useCoinTypes from "src/hooks/useCoinTypes";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useUserCoinAddress from "./useUserCoinAddress";

const useCoinAddresses = () => {
    const coins = useUserCoinAddress();
    const available = useCoinTypes();
    const [data, setData] = useState({});
    const [addresses, setAddresses] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const handleError = useErrors();
    const { getUser } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (coins.length && available.length) {
            const newAvailable = available.map((item) => {
                const { address } =
                    coins.find(({ coin_id }) => coin_id === item.id) || {};
                return { ...item, address };
            });
            const newData = {};
            newAvailable.map(({ id, address }) => {
                newData[id] = address;
            });
            setData(newData);
            setAddresses(newAvailable);
        } else {
            const newAvailable = available.map((item) => {
                return { ...item, address: "" };
            });
            const newData = {};
            newAvailable.map(({ id, address }) => {
                newData[id] = address;
            });
            setData(newData);
            setAddresses(newAvailable);
        }
    }, [available, coins]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const re = new RegExp(/^^$|[a-zA-Z0-9]+$/i);
        if (re.test(value)) setData({ ...data, [name]: value });
    };

    const { isAdmin } = useAuth();
    const { mid } = useParams();

    const onSubmit = async () => {
        setLoading(true);
        const URL = isAdmin
            ? `api/user-coin-address/${mid}`
            : "api/user/user-coin-address";
        const reqData = new FormData();

        Object.entries(data).forEach(([k, v]) => {
            if (v !== undefined) {
                reqData.append(k, v);
            }
        });
        try {
            const { data, status } = await axiosInstance.post(URL, reqData);
            if (status === 200) {
                await getUser();
                setLoading(false);
                enqueueSnackbar(data.message);
            }
        } catch (err) {
            setLoading(false);
            handleError(err);
        }
    };

    return { loading, addresses, data, handleChange, onSubmit };
};

export default useCoinAddresses;
