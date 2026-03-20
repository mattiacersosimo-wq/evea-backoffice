import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";

const useGetProductCategories = () => {
  const handleErrors = useErrors();
  const [productCategories, setProductCategories] = useState([]);
  const [state, actions] = useDataHandler();
  const { count, onChange, page, seed } = usePagination();

  const fetchProductCategories = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance(
        `/api/admin/product-categories?page=${page}`
      );

      const { status, data: categories } = data;
      if (status) {
        setProductCategories(categories.data);
        actions.success(categories?.data);
        seed(categories.last_page);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      handleErrors(err);
    }
  };
  useEffect(() => {
    fetchProductCategories(page);
  }, [page]);

  return {
    state,
    productCategories,
    fetchProductCategories,
    count,
    onChange,
    page,
  };
};

export default useGetProductCategories;
