import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import useGetBlogCategory from "./hooks/useGetBlogCategory";
import useGetProduct from "./hooks/useGetProduct";

const BlogFilter = () => {
  const productList = useGetProduct();
  const blogCategory = useGetBlogCategory();
  const { watch, setValue } = useFormContext();
  const { product_id, category_id, keyword } = watch();

  const selectedProduct =
    productList.find(({ id }) => id === product_id) || null;

  const selectedCategory =
    blogCategory.find(({ id }) => id === category_id) || null;

  const { t } = useTranslation();

  return (
    <Grid container columnGap={1} rowGap={1}>
      <Grid item xs={12} md={3}>
        <Autocomplete
          value={selectedProduct}
          onChange={(_, v) => setValue("product_id", v ? v.id : null)}
          options={productList}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              size="small"
              label={t("search.product")}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <Autocomplete
          onChange={(_, v) => setValue("category_id", v ? v.id : null)}
          value={selectedCategory}
          options={blogCategory}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              size="small"
              label={t("search.category")}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <RHFTextField
          size="small"
          name="keyword"
          label="search.search"
          value={keyword}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <Button fullWidth variant="contained" type="submit" sx={{height:"40px"}}>
          <Translate>search.search</Translate>
        </Button>
      </Grid>
    </Grid>
  );
};
export default BlogFilter;
