import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";

const usePackageCouponId = () => {
  const [packages, setPackages] = useState({ name: "", image: "", price: "" });
  const { id } = useParams();

  const handleErrors = useErrors();
  const fetchData = async (id) => {
    try {
      const { data, status } = await fetchUser(
        `coupon-package-price-list/${id}`
      );
      if (status) {
        const { name, package_price, product_image } = data?.data || {};

        setPackages({
          name,
          price: package_price?.price || "",
          image: product_image?.image_url || "",
        });
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    fetchData(id);
  }, [id]);

  return packages;
};

export default usePackageCouponId;
