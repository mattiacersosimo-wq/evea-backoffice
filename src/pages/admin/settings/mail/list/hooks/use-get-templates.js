import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import axiosInstance from "src/utils/axios";

const useGetTemplates = () => {
  const [state, actions] = useDataHandler();
  const { enqueueSnackbar } = useSnackbar();
  const fetchData = async () => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get("api/admin/email-template");
      actions.success(data.data || []);
    } catch (err) {
      actions.error();
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return { state };
};

export default useGetTemplates;
