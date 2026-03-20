import React from "react";
import useGetCategoryById from "./useGetCategoryById";
import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";

const useUpdateCategory = (selectedId, cb) => {
  const methods = useGetCategoryById(selectedId);
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );
    reqData.append("_method", "PUT");
    reqData.append("active", 0);
    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/blog-categories/${selectedId}`,
        reqData
      );
      if (status === 200) {
        cb();
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useUpdateCategory;
