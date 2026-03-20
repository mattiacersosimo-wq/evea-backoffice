import { useMemo } from "react";
import { useParams } from "react-router";

const useIsSubscription = () => {
  const { product_type } = useParams();

  return useMemo(() => {
    return product_type === "subscriptions";
  }, [product_type]);
};

export default useIsSubscription;
