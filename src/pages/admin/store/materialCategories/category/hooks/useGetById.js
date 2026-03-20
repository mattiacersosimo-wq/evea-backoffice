import { useSnackbar } from "notistack";
import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import useCategoryForm from "./useCategoryForm";

const useGetCategoryById = (id) => {
  const methods = useCategoryForm();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          `/api/admin/material-categories/${id}`
        );
        if (status === 200) {
          const { name, sort_order } = data.data;
          methods.reset({
            name,
            sort_order,
          });
        }
      } catch (err) {
        Object.values(err).flatMap((item) =>
          enqueueSnackbar(item, { variant: "error" })
        );
      }
    };

    if (id) fetchData();
  }, [id]);

  return methods;
};

export default useGetCategoryById;
