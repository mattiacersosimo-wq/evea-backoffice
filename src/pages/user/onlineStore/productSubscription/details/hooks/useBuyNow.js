import { useNavigate } from "react-router";
import { PATH_USER } from "src/routes/paths";
import useAddToCart from "../../hooks/useAddToCart";

const useBuyNow = () => {
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  return async (data) => {
    const status = await addToCart(data);
    if (status) {
      navigate(PATH_USER.onlineStore.productSubscription.checkout);
    }
  };
};

export default useBuyNow;
