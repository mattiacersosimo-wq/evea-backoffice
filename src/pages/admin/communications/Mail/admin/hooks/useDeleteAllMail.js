import React from "react";
import { useSnackbar } from "notistack";
import { useOutletContext, useParams } from "react-router";
import axiosInstance from "src/utils/axios";
import useAuth from "src/hooks/useAuth";

const useDeleteAllMail = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { fetchData } = useOutletContext();
  const { isAdmin } = useAuth();
  const params = useParams();
  const handleDelete =
    (selectedId) =>
    async (cb = () => null) => {
      const data = new FormData();
      data.append("_method", "DELETE");
      selectedId.map((item) => data.append("emailIds[]", item));
      const URL = isAdmin ? `admin` : `user`;
      const { status, data: responseData } = await axiosInstance.post(
        `/api/${URL}/deletemail?type=${params.systemLabel}`,
        data
      );
      if (status === 200) {
        enqueueSnackbar(responseData.message);
        fetchData();
        cb();
        return;
      }
      enqueueSnackbar("Failed to delete the Mail", { variant: "error" });
    };

  return handleDelete;
};

export default useDeleteAllMail;
