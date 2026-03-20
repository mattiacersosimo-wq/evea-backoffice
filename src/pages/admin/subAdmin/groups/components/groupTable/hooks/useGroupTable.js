import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useGroupTable = () => {
  const [state, actions] = useDataHandler();
  const [groupList, setGroupList] = useState([]);
  const { count, onChange, page, seed, rowStart } = usePagination();
  const handleErrors = useErrors();
  const fetchData = async (page = 1) => {
    actions.loading();
    try {
      const { data, status } = await axiosInstance(
        "api/admin/sub-admin-user-groups",
        { params: { page } }
      );
      if (status === 200) {
        const { last_page, from, data: list } = data.data;
        seed(last_page, from);
        actions.success(list);
      } else {
        actions.success([])
      }
    } catch (err) {
      actions.error();
      handleErrors(err);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return { state, groupList, fetchData, rowStart, onChange, count, page };
};
export default useGroupTable;
