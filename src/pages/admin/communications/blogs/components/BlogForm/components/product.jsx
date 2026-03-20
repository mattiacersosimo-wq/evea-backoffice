import { Autocomplete, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useProductList from "src/components/ProductAutoComplete/hooks/useProductList";

const Product = () => {
  const product = useProductList();
  const { watch } = useFormContext();
  const isShrink = Boolean(watch("product_id"));
  const {
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const name = "product_id";
  const selectedIds = getValues(name);

  const selected = product?.filter(({ id }) => selectedIds?.includes(id));

  const { t } = useTranslation();
  return (
    <Autocomplete
      multiple
      InputLabelProps={{
        shrink: isShrink,
      }}
      value={selected}
      options={product}
      onChange={(_, v) => {
        setValue(
          name,
          v.map(({ id }) => id)
        );
      }}
      getOptionLabel={({ name }) => name}
      renderInput={(params) => (
        <TextField
          label={t("blogs.create.form.product")}
          name="products"
          {...params}
          helperText={t(errors[name]?.message)}
          error={Boolean(errors[name])}
        />
      )}
    />
  );
};

export default Product;
