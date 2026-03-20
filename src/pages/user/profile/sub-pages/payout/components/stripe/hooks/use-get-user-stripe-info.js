import moment from "moment";
import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import useStripeForm from "./use-stripe-form";

const getDOB = (dob) => {
  const { day, month, year } = dob;
  return moment(`${month}/${day}/${year}`);
};

const useGetUserStripeInfo = () => {
  const methods = useStripeForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get("api/user/stripe-update");
        if (data.data) {
          const { external_account, individual } = data?.data || {};

          const {
            account_holder_name,
            account_holder_type,
            country,
            currency,
            routing_number,
            account_number,
          } = external_account || {};

          const {
            phone,
            gender,
            id_number,
            dob,
            first_name,
            last_name,
            address,
          } = individual || {};
          const { city, state, postal_code, line1, line2 } = address || {};

          methods.reset({
            account_holder_name,
            account_holder_type,
            country,
            currency,
            routing_number,
            account_number,
            phone,
            gender,
            id_number: id_number.replaceAll("-", ""),
            date_of_birth: getDOB(dob),
            first_name,
            last_name,
            city,
            state,
            postal_code,
            line1,
            line2,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return methods;
};

export default useGetUserStripeInfo;
