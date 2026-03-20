import { useSnackbar } from "notistack";
import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import useArticleForm from "./useArticleForm";

const useGetArticleById = (id) => {
  const methods = useArticleForm();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance.get(
          `api/admin/articles/${id}`
        );

        if (status === 200) {
          const { title, description, active, category_id } = data.data;
          methods.reset({
            active,
            category_id,
            description,
            title,
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

export default useGetArticleById;
