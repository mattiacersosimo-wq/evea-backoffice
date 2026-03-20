import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/fetchUser";

const useCouponPurchase = () => {
  const [state, actions] = useDataHandler();
  const { count, onChange, page, seed, rowStart } = usePagination();
  const fetchData = async (page = 1) => {
    try {
      const { data } = await axiosInstance.get(`coupon-purchase?page=${page}`);
      const { status, data: report } = data;
      if (status) {
        const { last_page, data: list, from } = report;
        seed(last_page, from);
        if (Boolean(list.length)) {
          actions.success(list);
          return;
        }
      }
      actions.success();
    } catch (err) {
      actions.error();
      console.log(err);
    }
  };
  useEffect(() => {
    actions.loading();
    fetchData(page);
  }, [page]);

  return { state, fetchData, count, onChange, page, rowStart };
};

export default useCouponPurchase;
