import { Button, Card, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";

import { PATH_USER } from "src/routes/paths";
import Summary from "../summary";
import CartTitle from "./cartTitle";
import EmptyCart from "./emptyCart";
import useCartList from "./hooks/useCartList";
import ProductList from "./productList";

const Cart = ({ nextStep }) => {
  const { isLoading } = useCartList();

  const handleNextStep = () => {
    nextStep();
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CartTitle />
          <Ternary
            when={isLoading}
            then={<EmptyCart />}
            otherwise={<ProductList />}
          />
        </Card>

        <Button
          color="inherit"
          component={RouterLink}
          to={PATH_USER.onlineStore.productSubscription.root}
          startIcon={<Iconify icon={"eva:arrow-ios-back-fill"} />}
          name="continue"
        >
          {"userOnlineStore.continueShopping"}
        </Button>
      </Grid>

      <Grid item xs={12} md={4}>
        <Summary enableDiscount />
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={isLoading}
          onClick={handleNextStep}
          name="next"
        >
          {"userOnlineStore.checkOut"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default Cart;
