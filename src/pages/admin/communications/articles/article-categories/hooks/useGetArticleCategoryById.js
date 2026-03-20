import { useSnackbar } from "notistack";
import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import useArticleCategoryForm from "./useArticleCategoryForm";

const useGetArticleCategoryById = (id) => {
  const methods = useArticleCategoryForm();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          `api/admin/article-categories/${id}`
        );
        if (status === 200) {
          const { name, description, active } = data.data;
          methods.reset({ name, description, active });
        }
      } catch (err) {
        Object.values(err).flatMap((item) =>
          enqueueSnackbar(item, { variant: "error" })
        );
      }
    };
    if (id) fetchData();
  }, [id]);

  return { methods };
};

export default useGetArticleCategoryById;
