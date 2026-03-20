import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import useMethods from "../../form-dialog/hooks/use-methods";

const useGetData = (id) => {
  const methods = useMethods();

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const { data } = await axiosInstance.get(
          `api/admin/registration-settings/${id}`
        );

        const {
          input_label,
          input_type,
          input_name,
          required,
          status,
          unique,
          type,
          dynamic,
          value,
          input_options,
        } = data.data;

        methods.reset({
          input_label,
          input_type,
          input_name,
          type,
          required,
          status,
          unique,
          dynamic: dynamic || 0,
          value: value || "",
          input_options: input_options || [],
        });
      } catch (err) {
        console.log(err);
      }
    };

    if (id) {
      fetchData(id);
    }
  }, [id]);

  return methods;
};

export default useGetData;
