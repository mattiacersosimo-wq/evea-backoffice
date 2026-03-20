import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";

const useCoupons = () => {
  const [state, actions] = useDataHandler();
  const { count, onChange, page, seed, rowStart } = usePagination();

  const fetchCouponList = async (page = 1) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/coupons?page=${page}`
      );
      const { status, data: coupons } = data;
      if (status) {
        const { last_page, data: list, from } = coupons;
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
    fetchCouponList(page);
  }, [page]);

  return { state, fetchCouponList, count, onChange, page, rowStart };
};

export default useCoupons;
