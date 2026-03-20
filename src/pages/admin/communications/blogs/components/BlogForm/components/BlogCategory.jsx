import { Autocomplete, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { useTranslation } from "react-i18next";
import useBlogCategories from "../hooks/useBlogCategories";
const BlogCategory = () => {
  const { categories } = useBlogCategories();

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const selectedIds = watch("category_id");
  const values = categories?.filter(({ id }) => selectedIds?.includes(id));
  const { t } = useTranslation();
  return (
    <>
      <Autocomplete
        multiple
        value={values}
        onChange={(e, v) => {
          setValue(
            "category_id",
            v.map(({ id }) => id)
          );
        }}
        options={categories}
        getOptionLabel={({ name }) => name}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("blogs.create.form.category")}
            name="category"
            error={Boolean(errors.category_id)}
            helperText={t(errors.category_id?.message)}
          />
        )}
      />
    </>
  );
};

export default BlogCategory;
