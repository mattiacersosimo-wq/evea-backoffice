import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import useIsPackage from "src/components/package-or-product/hooks/use-is-package";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import createReqData from "../../../utils/createReqData";
import useProductForm from "../../product-form/hooks/use-product-form";
import useIsSubscription from "src/components/package-or-product/hooks/use-is-subscription";

const useAddProduct = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isPackage = useIsPackage();
  const isSubscription = useIsSubscription();

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
        const redirectPath = isPackage
          ? PATH_DASHBOARD.store.packages
          : isSubscription
          ? PATH_DASHBOARD.store.subscriptions
          : PATH_DASHBOARD.store.products;
        navigate(redirectPath);
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
