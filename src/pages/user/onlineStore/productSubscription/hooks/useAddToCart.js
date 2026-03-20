import { useSnackbar } from "notistack";
import useAuth from "src/hooks/useAuth";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";

const useAddToCart = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { incrementCart } = useAuth();
  const handleErrors = useErrors();
  const addToCart = async ({ price, product_id, price_id }) => {
    const reqData = new FormData();
    reqData.append("price", price);
    reqData.append("product_id", product_id);
    reqData.append("price_id", price_id);

    try {
      const { data } = await fetchUser.post("cart", reqData);
      const { status, message, cart_count: cartCount } = data;
      if (status) {
        enqueueSnackbar(message);
        incrementCart(cartCount);
      }
      return status;
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
      handleErrors(err);
    }
  };

  return addToCart;
};

export default useAddToCart;
