import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";
import serializeDate from "src/utils/serialize-date";

const useFetchSummary = (url, filter = {}) => {
    const [summary, setSummary] = useState({});
    const handleErrors = useErrors();

    const fetchData = async (filter = {}) => {
        try {
            const { data, status } = await (
                await fetchUser(url, {
                    params: { ...filter },
                })
            ).data;
            if (status) {
                setSummary(data);
            }
        } catch (err) {
            handleErrors(err);
        }
    };

    useEffect(() => {
        const { start_date, end_date, ...rest } = filter;
        fetchData({
            start_date: serializeDate(start_date),
            end_date: serializeDate(end_date),
            ...rest,
        });
    }, []);

    return { summary, fetchData };
};

export default useFetchSummary;
