import { useFormContext } from "react-hook-form";
import RHFAutoComplete from "src/components/hook-form/RHFAutoComplete";
import useProductList from "src/components/ProductAutoComplete/hooks/useProductList";

const Product = ({ size }) => {
  const options = useProductList();
  const { setValue } = useFormContext();
  return (
    <RHFAutoComplete
      onChange={(_, v) => {
        if (v) setValue("product_id", v.id);
        else setValue("product_id", "");
      }}
      name="product_id"
      label="Products"
      options={options}
      getOptionLabel={(option) => option.name}
      size={size}
    />
  );
};

export default Product;
