import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import productAutoComplete from "src/api/autoComplete/product";

const useProductList = (type) => {
  const { enqueueSnackbar } = useSnackbar();
  const [productList, setProductList] = useState([]);
  const fetchData = async () => {
    const query = {
      is_combo: type === "combo" ? 1 : null,
      is_normal: type === "normal" ? 1 : null,
    };
    const { status, data, message } = await productAutoComplete(query);
    if (status) {
      setProductList(data);
    } else {
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return productList;
};
export default useProductList;
