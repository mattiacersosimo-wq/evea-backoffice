import { useEffect } from "react";
import { useParams } from "react-router";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";

const useProductList = () => {
  const [state, actions] = useDataHandler();
  const { onChange, page, seed, count } = usePagination();
  const { product_type } = useParams();

  const fetchProducts = async (pageNumber = 1, active = -1) => {
    try {
      const { data } = await axiosInstance.get("/api/admin/products", {
        params: {
          page: pageNumber,
          active: active,
          product_type,
        },
      });
      const { status, data: products } = data;

      if (status) {
        const { last_page, from, data: list } = products;
        seed(last_page, from);
        if (Boolean(list.length)) {
          actions.success(list);
          return;
        }
        actions.success();
      } else {
        actions.success();
        seed(1, 0);
      }
    } catch (error) {
      actions.error();
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    fetchProducts(page);
    actions.loading();
  }, [page, product_type]);

  return { state, onChange, page, count, fetchProducts };
};
export default useProductList;
