import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import usePriorityForm from "./usePriorityForm";

const useGetPriorityById = (id) => {
  const methods = usePriorityForm();

  useEffect(() => {
    const fetchData = async () => {
      const { status, data } = await axiosInstance.get(
        `api/admin/support-ticket-priorities/${id}`
      );

      if (status === 200) {
        const { name, description, sort_order, active, color } = data.data;

        methods.reset({
          name,
          description,
          sort_order,
          active,
          color,
          _method: "PUT",
        });
      }
    };

    if (id) fetchData();
  }, []);

  return methods;
};

export default useGetPriorityById;
