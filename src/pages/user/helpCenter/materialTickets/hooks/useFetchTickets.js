import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import useTimeOut from "src/components/timeout/hooks/useTimeOut";
import fetchUser from "src/utils/fetchUser";

const defaultValues = {
  category_id: null,
  department_id: null,
  status: null,
  ticket_number: null,
  priority_id: null,
  overdue: null,
};

const useFetchTickets = () => {
  const { label } = useParams();
  const [state, actions] = useDataHandler();

  const methods = useForm({ defaultValues });
  const status = methods.watch("status");
  const { count, onChange, page, rowStart, seed } = usePagination();
  const { setValue, handleSubmit, getValues } = methods;

  useEffect(() => {
    if (label !== "all") methods.setValue("status", label);
    else setValue("status", null);
  }, [label]);

  const fetchData = async (page = 1, filter = {}) => {
    actions.loading();
    try {
      const { status, data } = await (
        await fetchUser("support-tickets", {
          params: { ...filter, page },
        })
      ).data;
      if (status) {
        const { data: list, last_page, from } = data;
        if (list.length > 0) {
          seed(last_page, from);
        }
        onChange(null, page);
        actions.success(list);
        return;
      }
      actions.success([]);
    } catch (err) {
      actions.error();
    }
  };

  const handleFilter = handleSubmit((inputData) => fetchData(1, inputData));

  useEffect(() => {
    fetchData(page, getValues());
  }, [page, status]);

  return {
    state,
    count,
    onChange,
    page,
    rowStart,
    methods,
    handleFilter,
  };
};

export default useFetchTickets;
