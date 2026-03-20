import { useEffect } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useProductCategoryForm from "./useProductCategoryForm";

const useGetProductCategoryById = (id) => {
  const methods = useProductCategoryForm();
  const handleErrors = useErrors();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance.get(
          `api/admin/product-categories/${id}`
        );
        if (status === 200) {
          const { name, active } = data.data;
          methods.reset({ active, name });
        }
      } catch (err) {
        handleErrors(err);
      }
    };
    if (id) fetchData();
  }, [id]);

  return methods;
};
export default useGetProductCategoryById;
