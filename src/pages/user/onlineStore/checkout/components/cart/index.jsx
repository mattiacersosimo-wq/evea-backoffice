import { Button, Card, Grid } from "@mui/material";
import { useState } from "react";
import { Link, Link as RouterLink } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";

import Translate from "src/components/translate";
import { PATH_USER } from "src/routes/paths";
import usePackageInCart from "../../hooks/use-package-in-cart";
import Summary from "../summary";
import CartTitle from "./cartTitle";
import EmptyCart from "./emptyCart";
import useCartList from "./hooks/useCartList";
import ProductList from "./productList";

const Cart = () => {
  const { isLoading, fetchData } = useCartList();
  const [couponName, setCouponName] = useState("");
  const isPackage = usePackageInCart();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CartTitle />
          <Ternary
            when={isLoading}
            then={<EmptyCart />}
            otherwise={
              <ProductList setCouponName={(v = "") => setCouponName(v)} />
            }
          />
        </Card>

        <Button
          color="inherit"
          component={RouterLink}
          to={
            isPackage
              ? PATH_USER.onlineStore.productSubscription.packages.root
              : PATH_USER.onlineStore.productSubscription.products.root
          }
          startIcon={<Iconify icon={"eva:arrow-ios-back-fill"} />}
        >
          <Translate>{"user.online_store.product.continue"}</Translate>
        </Button>
      </Grid>

      <Grid item xs={12} md={4}>
        <Summary couponName={couponName} />
        {/* <Button
          LinkComponent={Link}
          state={{ couponName }}
          to="payment"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={isLoading}
        >
          <Translate>{"user.online_store.product.checkout"}</Translate>{" "}
        </Button> */}

        <Button
          LinkComponent={Link}
          state={{ couponName }}
          to="shipping"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={isLoading}
        >
          <Translate>{"user.online_store.product.checkout"}</Translate>
        </Button>
      </Grid>
    </Grid>
  );
};

export default Cart;
