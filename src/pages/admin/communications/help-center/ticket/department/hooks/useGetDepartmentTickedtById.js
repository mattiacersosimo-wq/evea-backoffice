import { useSnackbar } from "notistack";
import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import useDepartmentTicketForm from "./useDepartmentTicketForm";

const useGetDepartmentTickedById = (id) => {
  const methods = useDepartmentTicketForm();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance.get(
          `api/admin/support-ticket-department/${id}`
        );

        if (status === 200) {
          const { name, description, sort_order, active } = data.data;
          methods.reset({ name, description, sort_order, active });
        }
      } catch (err) {
        Object.values(err).flatMap((item) =>
          enqueueSnackbar(item, { variant: item })
        );
      }
    };
    if (id) fetchData();
  }, [id]);
  return methods;
};
export default useGetDepartmentTickedById;
