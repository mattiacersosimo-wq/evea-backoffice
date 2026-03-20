import { useEffect } from "react";
import fetchUser from "src/utils/fetchUser";
import {
  load as loadCart,
  useCartData,
  useCartDispatch,
} from "../../../store/cartStore";
import {
  load as loadPurchase,
  usePurchaseDispatch,
} from "../../../store/purchaseStore";

export const fetchCart = async () => {
  try {
    const { data } = await fetchUser("cart");
    const { status } = data;
    if (status) return data.data;
    return [];
  } catch (err) {
    return [];
  }
};

const useCartList = () => {
  const cartDispatch = useCartDispatch();
  const cartList = useCartData() || [];

  const purchaseDispatch = usePurchaseDispatch();
  useEffect(() => {
    purchaseDispatch(loadPurchase(cartList));
  }, [cartList]);

  const fetchData = async () => {
    const data = await fetchCart();
    cartDispatch(loadCart(data));
  };
  useEffect(() => {
    fetchData();
  }, []);

  return { isLoading: cartList.length === 0 };
};

export default useCartList;
