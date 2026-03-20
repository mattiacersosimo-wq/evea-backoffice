import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PATH_USER } from "src/routes/paths";
import fetchUser from "src/utils/fetchUser";

const useGetProduct = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [product, setProduct] = useState({ images: [], colors: ["#000"] });
  const fetchProducts = async () => {
    try {
      const { status, data } = await fetchUser(`online-stores/${name}`);
      if (status === 200) {
        setProduct(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (name) fetchProducts();
    else navigate(PATH_USER.onlineStore.productSubscription.root);
  }, [name]);

  return { product, fetchProducts };
};

export default useGetProduct;
