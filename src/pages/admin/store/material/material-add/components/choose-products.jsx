import { Autocomplete, TextField } from "@mui/material";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useProductList from "src/components/ProductAutoComplete/hooks/useProductList";

import useQueryParams from "src/hooks/useQueryParams";

const ChooseProducts = () => {
  const productList = useProductList();
  const { t } = useTranslation();
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const {
    queryObject: { id },
  } = useQueryParams();
  useEffect(() => {
    if (id) {
      const parsedId = parseInt(id);

      const selected = productList.filter(({ id }) => id === parsedId);

      setValue("product_list", selected);
    }
  }, [id, productList]);
  const selected = watch("product_list");
  if (id) {
    if (selected.length)
      return (
        <Controller
          control={control}
          name="product_list"
          render={({ field: { ref, onChange, ...field } }) => (
            <Autocomplete
              options={productList}
              disabled
              getOptionLabel={({ name }) => name}
              onChange={(_, v) => {
                setValue(
                  "product_list",
                  v.map(({ id }) => id)
                );
              }}
              defaultValue={selected[0]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  {...field}
                  fullWidth
                  inputRef={ref}
                  label={t("material.add_material.choose_product")}
                />
              )}
            />
          )}
        />
      );
    return null;
  }
  return (
    <Controller
      control={control}
      name="product_list"
      render={({ field }) => (
        <Autocomplete
          {...field}
          multiple
          onChange={(_, newValue) => {
            field.onChange(newValue);
          }}
          options={productList}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              label={t("material.add_material.choose_product")}
              {...params}
              error={Boolean(errors.product_list)}
              helperText={t(errors.product_list?.message)}
            />
          )}
        />
      )}
    />
  );
};

export default ChooseProducts;
