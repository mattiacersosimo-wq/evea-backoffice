import { useEffect, useState } from "react";

const useSubscriptions = (prices) => {
  const [price, setPrice] = useState({ price: null, id: null });
  const onChange = (e) => {
    const data = JSON.parse(e.target.value);
    setPrice(data);
  };

  useEffect(() => {
    if (!price.price) {
      const { id, price } = prices.find(Boolean) || {};
      if (id && price) {
        setPrice({ id, price });
      }
    }
  }, [price]);

  return { price, onChange };
};

export default useSubscriptions;
