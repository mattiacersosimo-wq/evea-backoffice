import { useSnackbar } from "notistack";
import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";

const useGetLead = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, actions] = useDataHandler();
  const { count, onChange, page, seed, rowStart } = usePagination();

  const fetchData = async (page) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get("/api/user/lead-capture", {
        params: { page },
      });

      const { status } = data;
      if (status) {
        const { last_page, from, data: list } = data.data;
        seed(last_page, from);
        actions.success(list);
      }
    } catch (err) {
      actions.error();
      console.log(err);
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };
  useEffect(() => {
    fetchData(page);
  }, [page]);

  return { state, fetchData, count, onChange, page, rowStart };
};

export default useGetLead;
