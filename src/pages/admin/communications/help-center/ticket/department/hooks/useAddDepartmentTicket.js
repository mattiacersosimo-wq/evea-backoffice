import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useDepartmentTicketForm from "./useDepartmentTicketForm";

const useAddDepartmentTicket = (cb) => {
  const methods = useDepartmentTicketForm();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (reqdata) => {
    let data = new FormData();
    data.append("name", reqdata.name);
    data.append("description", reqdata.description);
    data.append("sort_order", reqdata.sort_order);
    data.append("active", 1);
    try {
      const { status, data: resData } = await axiosInstance({
        method: "post",
        url: "/api/admin/support-ticket-department/",
        data: data,
      });
      if (status === 200) {
        cb();
        enqueueSnackbar(resData.message);
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
      Object.entries(error.errors).flatMap(([k, v]) =>
        methods.setError(k, { message: v?.find(Boolean) })
      );
    }
  };
  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useAddDepartmentTicket;
