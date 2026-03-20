import { Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import useErrors from "src/hooks/useErrors";

import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import Form from "./Form";
import useGetCouponById from "./hooks/useGetCouponById";
import genReqData from "./utils/genReqData";

const CouponEdit = () => {
  const navigate = useNavigate();
  const methods = useGetCouponById();
  const { enqueueSnackbar } = useSnackbar();
  const handleErrors = useErrors();
  const onSubmit = async (inputData) => {
    const { id, ...editData } = inputData;
    const reqData = genReqData(editData);
    reqData.append("_method", "PUT");

    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/coupons/${id}`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        navigate(PATH_DASHBOARD.store.coupons);
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  return (
    <>
      <Page title={"coupons.edit_coupon_title"}>
        <Box sx={{ p: 2 }}>
          <HeaderBreadcrumbs
            heading={"coupons.edit_coupon"}
            links={[
              { name: "dashboard", href: PATH_DASHBOARD.root },
              {
                name: "coupons.coupon",
                href: PATH_DASHBOARD.store.coupons,
              },
              { name: "coupons.edit_coupon" },
            ]}
          />

          <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)} />
        </Box>
      </Page>
    </>
  );
};

export default CouponEdit;
