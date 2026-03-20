import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import genReqData from "../utils/genReqData";
import useCouponForm from "./useCouponForm";

const useAddCoupon = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const methods = useCouponForm();
  const onSubmit = async (inputData) => {
    genReqData(inputData);
    try {
      const { status, data } = await axiosInstance.post(
        "/api/admin/coupons",
        genReqData(inputData)
      );

      if (status === 200) {
        enqueueSnackbar(data.message);
        navigate(PATH_DASHBOARD.store.coupons);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useAddCoupon;
