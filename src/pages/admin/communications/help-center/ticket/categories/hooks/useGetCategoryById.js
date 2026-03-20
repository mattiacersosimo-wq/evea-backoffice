import { useSnackbar } from "notistack";
import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import useCategoriesForm from "./useCategoriesForm";

const useGetCategoryById = (id) => {
  const methods = useCategoriesForm();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          `api/admin/support-ticket-categories/${id}`
        );
        if (status === 200) {
          const { name, active, description } = data.data;
          methods.reset({
            name,
            active,
            description,
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
