import { useSnackbar } from "notistack";
import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import useBusinessForm from "./useBusinessForm";

const useGetCategoryById = (id) => {
  const methods = useBusinessForm();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          `/api/admin/business-builder/${id}`
        );
        if (status === 200) {
          const { name, amount, bv } = data.data;
          methods.reset({
            name,
            amount,
            bv,
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
