import { useMemo, useState } from "react";
import { useCartData } from "../store/cartStore";

const usePackageInCart = () => {
  const [pack, setPack] = useState();
  const cart = useCartData();

  return useMemo(() => {
    if (cart?.length > 0) {
      setPack(cart[0]?.product?.is_package);
      return Boolean(cart[0]?.product?.is_package);
    } else {
      return pack;
    }
  }, [cart]);
};

export default usePackageInCart;
