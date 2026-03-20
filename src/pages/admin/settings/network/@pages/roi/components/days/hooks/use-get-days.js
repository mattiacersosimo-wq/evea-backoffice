import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import axiosInstance from "src/utils/axios";

const useGetDays = () => {
  const methods = useForm();
  const { control } = methods;
  const field = useFieldArray({
    control,
    name: "day",
  });

  const { replace } = field;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get("api/admin/roi-days");
        replace(
          data.data?.map(({ id, days, is_enable }) => ({
            did: id,
            name: days,
            active: Boolean(is_enable),
          }))
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return { methods, field };
};

export default useGetDays;
