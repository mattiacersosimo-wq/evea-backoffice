import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import createReqData from "../../../utils/createReqData";
import useProductForm from "../../product-form/hooks/use-product-form";

const useAddProduct = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useProductForm();
  const { setError } = methods;
  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance({
        method: "post",
        url: "/api/admin/products",
        data: createReqData(data),
      });
      if (res.status === 200) {
        enqueueSnackbar(res.data.message);
        navigate(PATH_DASHBOARD.store.products);
      }
    } catch (err) {
      Object.entries(err.errors).forEach(([k, v]) =>
        setError(k, { message: v[0] })
      );
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useAddProduct;
