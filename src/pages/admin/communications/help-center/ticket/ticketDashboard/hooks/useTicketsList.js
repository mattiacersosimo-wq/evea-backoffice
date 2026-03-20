import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const PassingStatus = {
  overdue: "overdue",
  open: "open",
  inprogress: "in_progress",
  resolved: "resolved",
  closed: "closed",
  responded: "responded",
};

const useTicketList = (filter) => {
  const [state, actions] = useDataHandler();
  const handleErrors = useErrors();
  const { count, onChange, page, seed, rowStart } = usePagination();
  const { type } = useParams();
  const fetchTicketList = async (page = 1, filter = {}) => {
    const { overdue: check, ...rest } = filter;
    const overdue = check ? true : null;
    actions.loading();
    try {
      const { data } = await axiosInstance(`api/admin/support-tickets`, {
        params: {
          page,
          status: PassingStatus[type],
          ...rest,
          overdue: overdue,
        },
      });
      const { status, data: tickets } = data;

      if (status) {
        const { last_page, data: list, from } = tickets;
        seed(last_page, from);
        onChange(null, page);
        actions.success(list);
        return;
      }
      onChange(null, 1);
      actions.success([]);
    } catch (err) {
      actions.error();
      handleErrors(err);
    }
  };
  useEffect(() => {
    fetchTicketList(page, {
      ...filter,
      status: filter.status ? filter.status : PassingStatus[type] || null,
    });
  }, [page, type]);

  return {
    state,
    fetchTicketList,
    count,
    onChange,
    page,
    rowStart,
  };
};

export default useTicketList;
