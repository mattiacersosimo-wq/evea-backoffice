import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";
import serializeDate from "src/utils/serialize-date";

const useFetchWitPagination = (url, filter = {}) => {
    const [state, actions] = useDataHandler();

    const handleErrors = useErrors();
    const { count, onChange, page, rowStart, seed } = usePagination();
    const fetchData = async (page = 1, filter = {}) => {
        actions.loading();

        try {
            const { data, status } = await (
                await fetchUser.get(url, {
                    params: {
                        page,
                        ...filter,
                    },
                })
            ).data;
            if (status) {
                const { data: list, from, last_page } = data;
                if (Boolean(list.length)) {
                    seed(last_page, from);
                    onChange(null, page);
                    actions.success(list);
                    return;
                }
            }
            actions.success();
        } catch (err) {
            console.log(err);
            actions.error();
            handleErrors(err);
        }
    };
    useEffect(() => {
        const { start_date, end_date, ...rest } = filter;
        fetchData(page, {
            start_date: serializeDate(start_date),
            end_date: serializeDate(end_date),
            ...rest,
        });
    }, [page]);

    return { state, count, onChange, page, rowStart, fetchData };
};

export default useFetchWitPagination;
