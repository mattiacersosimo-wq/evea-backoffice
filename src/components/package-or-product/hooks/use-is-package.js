import { useMemo } from "react";
import { useParams } from "react-router";

const useIsPackage = () => {
  const { product_type } = useParams();

  return useMemo(() => {
    return product_type === "packages";
  }, [product_type]);
};

export default useIsPackage;
