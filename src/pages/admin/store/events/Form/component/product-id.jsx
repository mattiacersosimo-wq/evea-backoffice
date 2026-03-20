import { Autocomplete, TextField } from "@mui/material";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useProductList from "src/components/ProductAutoComplete/hooks/useProductList";
import useIsPackage from "src/components/package-or-product/hooks/use-is-package";

const ProductId = ({ name = "product_id" }) => {
  const isPackage = useIsPackage();
  const productList = useProductList();
  const { t } = useTranslation();
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const productId = watch(name);

  const selected = useMemo(() => {
    if (productList.length > 0 && Boolean(productId)) {
      return productList.filter(({ id }) => productId.includes(id));
    }

    return [];
  }, [productList, productId]);

  const error = errors[name];

  const subtitle = useMemo(() => {
    if (isPackage) {
      return "nav.store.packages";
    }
    return "nav.store.products";
  }, [isPackage]);
  return (
    <Autocomplete
      multiple
      limitTags={1}
      size="small"
      value={selected}
      options={productList}
      getOptionLabel={({ name }) => name}
      onChange={(_, v) => {
        if (v) {
          setValue(
            name,
            v.map(({ id }) => id)
          );
        } else {
          setValue(name, []);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          size="small"
          label={t(subtitle)}
          error={Boolean(error)}
          helperText={t(error?.message)}
        />
      )}
    />
  );
};

export default ProductId;
