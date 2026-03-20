import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Ternary from "src/components/ternary";
import { Currency } from "src/components/with-prefix";

import Translate from "src/components/translate";
import { useCartData } from "../../store/cartStore";
import { usePurchaseData } from "../../store/purchaseStore";
import RemoveCoupon from "../remove-coupon";
import ApplyCoupon from "./apply-coupon";

const Summary = ({ couponName, showCoupon = false, fetchPaymentMethods }) => {
  const cart = useCartData();
  const { total_amount: total, actualPrices } = usePurchaseData() || {};

  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (cart) {
      const totalDiscount = cart.reduce(
        (acc, { discount_amount }) => acc + parseFloat(discount_amount || 0),
        0
      );
      setDiscount(totalDiscount);
    }
  }, [cart]);

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={
          <Typography variant="subtitle2">
            <Translate>{"user.online_store.product.order_summary"}</Translate>
          </Typography>
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <Translate>{"user.online_store.product.sub_total"}</Translate>
            </Typography>
            <Typography variant="subtitle2">
              <Currency>{actualPrices}</Currency>
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <Translate>{"user.online_store.product.discount"}</Translate>
            </Typography>
            <Typography variant="subtitle2">
              <Currency>{discount}</Currency>
            </Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">
              <Translate>{"user.online_store.product.total"}</Translate>
            </Typography>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="subtitle1" sx={{ color: "error.main" }}>
                <Currency>{total}</Currency>
              </Typography>
            </Box>
          </Stack>

          {/* <Ternary
            when={discount && showCoupon}
            then={
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography color="success.main" variant="body2">
                  Your coupon {couponName} has been applied
                </Typography>
                <RemoveCoupon fetchPaymentMethods={fetchPaymentMethods} />
              </Stack>
            }
            otherwise={ */}
              <Ternary
                when={showCoupon}
                then={<ApplyCoupon fetchPaymentMethods={fetchPaymentMethods} />}
              />
            {/* }
          /> */}
        </Stack>
      </CardContent>
    </Card>
  );
};

Summary.propTypes = {
  total: PropTypes.number,
  discount: PropTypes.number,
  subtotal: PropTypes.number,
  shipping: PropTypes.number,
  onEdit: PropTypes.func,
  enableEdit: PropTypes.bool,
  enableDiscount: PropTypes.bool,
};

export default Summary;
