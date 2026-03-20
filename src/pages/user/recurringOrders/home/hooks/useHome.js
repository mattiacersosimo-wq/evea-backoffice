import { useEffect, useState } from "react";
import { useParams } from "react-router";
import fetchUser from "src/utils/fetchUser";

const useHome = () => {
  const { id } = useParams();
  const [subscription, setSubscription] = useState({});

  const fetchData = async () => {
    try {
      const { data, status } = await (
        await fetchUser(`subscription-product-view/${id}`)
      ).data;

      if (status) {
        setSubscription(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  return subscription;
};

export default useHome;
