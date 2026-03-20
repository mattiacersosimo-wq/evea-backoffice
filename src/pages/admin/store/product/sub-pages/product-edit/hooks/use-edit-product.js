import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router";
import useIsPackage from "src/components/package-or-product/hooks/use-is-package";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import buildPath from "src/utils/build-path";
import createReqData from "../../../utils/createReqData";
import useGetProductById from "./use-get-product-by-id";
import useIsSubscription from "src/components/package-or-product/hooks/use-is-subscription";

const useEditProduct = () => {
  const methods = useGetProductById();
  const isPackage = useIsPackage();
  const isSubscription = useIsSubscription();
  const { pid } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, setError, watch } = methods;

  const onSubmit = handleSubmit(async (inputData) => {
    const reqData = createReqData(inputData);
    reqData.append("_method", "PUT");
    try {
      const { data } = await axiosInstance.post(
        buildPath(`/api/admin/products`, pid),
        reqData
      );
      enqueueSnackbar(data.message);
      navigate(
        isPackage
          ? PATH_DASHBOARD.store.packages
          : isSubscription
          ? PATH_DASHBOARD.store.subscriptions
          : PATH_DASHBOARD.store.products,
      );
    } catch (err) {
      if (Boolean(err.errors)) {
        Object.entries(err.errors).forEach(([k, v]) =>
          setError(k, { message: v?.find(Boolean) })
        );
      }
    }
  });

  return { methods, onSubmit };
};

export default useEditProduct;
