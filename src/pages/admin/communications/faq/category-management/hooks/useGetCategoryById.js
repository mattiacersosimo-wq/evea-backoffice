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
          `api/admin/faq-categories/${id}`
        );

        if (status === 200) {
          const { active, name, description } = data.data;
          methods.reset({ active, name, description });
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
