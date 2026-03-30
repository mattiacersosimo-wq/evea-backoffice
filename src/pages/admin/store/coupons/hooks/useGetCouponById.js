import moment from "moment";
import { useEffect } from "react";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";
import useCouponForm from "./useCouponForm";

const useGetCouponById = () => {
  const { cid } = useParams();
  const methods = useCouponForm();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          `api/admin/coupons/${cid}`
        );

        if (status === 200) {
          const {
            product_id,
            created_at,
            deleted_at,
            start_date,
            end_date,
            ...rest
          } = data.data;

          methods.reset({
            start_date: moment(start_date),
            end_date: moment(end_date),
            product_id: product_id?.length > 0 ? product_id : [],
            ...rest,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (cid) fetchData();
  }, [cid]);

  return methods;
};

export default useGetCouponById;
