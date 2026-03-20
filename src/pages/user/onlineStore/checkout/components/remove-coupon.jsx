import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import axiosInstance from "src/utils/axios";
import { load, useCartDispatch } from "../store/cartStore";
import { usePurchaseDispatch } from "../store/purchaseStore";
import { fetchCart } from "./cart/hooks/useCartList";

const RemoveCoupon = ({ fetchPaymentMethods }) => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const cartDispatch = useCartDispatch();
  const dispatch = usePurchaseDispatch();
  const handleRemove = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("api/user/revert-coupon");
      const newCart = await fetchCart();
      fetchPaymentMethods();
      cartDispatch(load(newCart));
      dispatch(load(newCart));
      enqueueSnackbar(data.message);
      setLoading(false);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
      setLoading(false);
    }
  };

  return (
    <LoadingButton
      loading={loading}
      onClick={handleRemove}
      size="small"
      color="error"
    >
      remove
    </LoadingButton>
  );
};

export default RemoveCoupon;
