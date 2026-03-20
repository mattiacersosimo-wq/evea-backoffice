import { Button, Card, CardHeader, Grid, Typography } from "@mui/material";
import sum from "lodash/sum";
import { Link as RouterLink } from "react-router-dom";
import EmptyContent from "src/components/EmptyContent";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";

import empty from "src/images/ic_cart.svg";
import {
  applyDiscount,
  decreaseQuantity,
  deleteCart,
  increaseQuantity,
  onNextStep,
} from "src/redux/slices/product";
import { useDispatch, useSelector } from "src/redux/store";
import { PATH_DASHBOARD } from "src/routes/paths";
import CheckoutProductList from "./CheckoutProductList";
import CheckoutSummary from "./CheckoutSummary";

export default function CheckoutCart({ price = 0 }) {
  const dispatch = useDispatch();

  const { checkout } = useSelector((state) => state.product);

  const { cart, total, discount } = checkout;

  const totalItems = sum(cart.map((item) => item.quantity));

  const isEmptyCart = cart.length === 0;

  const handleDeleteCart = (productId) => {
    dispatch(deleteCart(productId));
  };

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleApplyDiscount = (value) => {
    dispatch(applyDiscount(value));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                {"userFinancial.depositWallet.card"}
                <Typography component="span" sx={{ color: "text.secondary" }}>
                  &nbsp;({totalItems} item)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {!isEmptyCart ? (
            <Scrollbar>
              <CheckoutProductList
                products={cart}
                onDelete={handleDeleteCart}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
              />
            </Scrollbar>
          ) : (
            <EmptyContent
              title={"userFinancial.depositWallet.cartIsEmpty"}
              description="Look like you have no items in your shopping cart."
              img={empty}
            />
          )}
        </Card>

        <Button
          color="inherit"
          component={RouterLink}
          to={PATH_DASHBOARD.eCommerce.root}
          startIcon={<Iconify icon={"eva:arrow-ios-back-fill"} />}
        >
          {"userFinancial.depositWallet.continueShopping"}
        </Button>
      </Grid>

      <Grid item xs={12} md={4}>
        <CheckoutSummary
          enableDiscount
          total={total + price}
          discount={discount}
          subtotal={price}
          onApplyDiscount={handleApplyDiscount}
        />
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={cart.length === 0}
          onClick={handleNextStep}
        >
          Check Out
        </Button>
      </Grid>
    </Grid>
  );
}
