import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ProductId from "src/pages/admin/store/events/Form/component/product-id";
import useGetProductCategory from "../hooks/useProductCategory";
import { useEffect } from "react";

const ProductFilter = () => {
  const productCategory = useGetProductCategory();
  const { watch, setValue } = useFormContext();
  const { category_id } = watch();

  const { t } = useTranslation();

  const selectedCategory =
    productCategory.find(({ id }) => id === category_id) || null;
  return (
    <Grid container columnGap={1} rowGap={1}>
      <Grid item xs={12} md={4}>
        <ProductId name="product_id" />
      </Grid>
      {/* <Grid item xs={12} md={4}>
        <Autocomplete
          onChange={(_, v) => setValue("category_id", v ? v.id : null)}
          value={selectedCategory}
          options={productCategory}
          limitTags={3}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              size="small"
              label={t("global.category_one")}
              name="category"
            />
          )}
        />
      </Grid> */}

      <Grid item xs={12} md={2}>
        <Button fullWidth variant="contained" type="submit" name="search">
          {t("global.search")}
        </Button>
      </Grid>
    </Grid>
  );
};
export default ProductFilter;
