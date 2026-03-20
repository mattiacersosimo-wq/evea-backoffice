import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useProductList from "src/components/ProductAutoComplete/hooks/useProductList";

const Products = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { setValue } = useFormContext();
  const productList = useProductList();
  const { t } = useTranslation();
  const onChange = (_, v) => {
    setValue(
      "products",
      v.map(({ id }) => id)
    );
    setSelectedProducts(v);
  };
  return (
    <Autocomplete
      size="small"
      value={selectedProducts}
      onChange={onChange}
      options={productList}
      multiple
      getOptionLabel={({ name }) => name}
      renderInput={(params) => (
        <TextField {...params} label={t("assign_subscriptions.products")} />
      )}
    />
  );
};

export default Products;
