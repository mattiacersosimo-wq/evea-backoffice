import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import useSubAdminForm from "src/pages/admin/subAdmin/subAdmins/hooks/useSubAdminForm.js";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";

const useAddSubAdmin = () => {
  const navigate = useNavigate();
  const methods = useSubAdminForm();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    const { product_ids, department_ids, excluded_products, ...rest } =
      inputData;
    Object.entries(rest).forEach(([key, value]) => reqData.append(key, value));
    reqData.append("product_ids", `[${product_ids}]`);
    // reqData.append("department_ids", `[${department_ids}]`);
    // reqData.append("excluded_products", `[${excluded_products}]`);

    try {
      const { status, data } = await axiosInstance.post(
        "api/admin/sub-admins",
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        navigate(PATH_DASHBOARD.subAdmin.sub_admins);
      }
    } catch (err) {
      Object.entries(err.errors).forEach(([k, v]) =>
        methods.setError(k, { message: v[0] })
      );
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useAddSubAdmin;
