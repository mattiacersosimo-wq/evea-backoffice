import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import axiosInstance from "src/utils/axios";
import { load, useCartData, useCartDispatch } from "../../../store/cartStore";
import { usePurchaseDispatch } from "../../../store/purchaseStore";
import { fetchCart } from "../../cart/hooks/useCartList";
import { useFormContext } from "react-hook-form";

const ApplyCoupon = ({ fetchPaymentMethods }) => {
  const { setValue } = useFormContext();
  const cartDispatch = useCartDispatch();
  const dispatch = usePurchaseDispatch();
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");
  const cart = useCartData();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const applyCoupon = async () => {
    setError("");
    setLoading(true);
    const reqData = new FormData();
    reqData.append("code", coupon.replace(/\s+/g, ""));

    try {
      const { status } = await axiosInstance.post(
        "api/user/apply-coupon",
        reqData
      );
      if (status === 200) {
        const newCart = await fetchCart();
        await fetchPaymentMethods();
        setValue("coupon_code", coupon.replace(/\s+/g, ""));
        cartDispatch(load(newCart));
        dispatch(load(newCart));
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError(err?.errors?.code?.find(Boolean));
    }
  };

  return (
    <TextField
      disabled={!cart?.length}
      name="code"
      fullWidth
      value={coupon}
      onChange={(e) => {
        setCoupon(e.target.value);
        if (error) setError("");
      }}
      placeholder={t("user.online_store.product.coupon")}
      helperText={error}
      color={Boolean(error) ? "error" : "primary"}
      error={Boolean(error)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <LoadingButton
              onClick={applyCoupon}
              loading={loading}
              disabled={!cart?.length}
              color={Boolean(error) ? "error" : "primary"}
              sx={{ mr: -0.5 }}
            >
              <Translate>{"user.online_store.product.apply"}</Translate>{" "}
            </LoadingButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default ApplyCoupon;
