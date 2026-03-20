import { snakeCase } from "lodash";
import { useEffect, useState } from "react";
import usePagination from "src/components/pagination/usePagination";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useMembers = (type, filter) => {
  const [membersList, setMembersList] = useState([]);
  const handleErrors = useErrors();
  const [state, actions] = useDataHandler();
  const { count, onChange, page, seed, rowStart } = usePagination();
  const filteredWatchValues = Object.fromEntries(
    Object.entries(filter).filter(([key, value]) => value !== "")
  );
  const fetchMemberList = async (page = 1) => {
    actions.loading();

    try {
      const { data } = await axiosInstance.get(`/api/admin/users`, {
        params: {
          ...filteredWatchValues,
          page,
          type: snakeCase(type),
        },
      });
      const { status, data: members } = data;
      if (status) {
        const { last_page, data: list, from } = members;
        seed(last_page, from);
        setMembersList(list);
        actions.success(list);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      handleErrors(err);
    }
  };

  useEffect(() => {
    fetchMemberList(page, filteredWatchValues);
  }, [page]);

  return {
    state,
    membersList,
    fetchMemberList,
    count,
    onChange,
    page,
    rowStart,
  };
};

export default useMembers;
