import { CardHeader, Typography } from "@mui/material";
import React from "react";

import { useCartData } from "../../store/cartStore";
import Translate from "src/components/translate";

const CartTitle = () => {
  const cartList = useCartData();
  const totalItems = cartList?.length;
  return (
    <CardHeader
      title={
        <Typography variant="h6">
          <Translate>{"user.online_store.product.cart"}</Translate>
          <Typography component="span" sx={{ color: "text.secondary" }}>
            &nbsp;({totalItems} item)
          </Typography>
        </Typography>
      }
      sx={{ mb: 3 }}
    />
  );
};

export default CartTitle;
