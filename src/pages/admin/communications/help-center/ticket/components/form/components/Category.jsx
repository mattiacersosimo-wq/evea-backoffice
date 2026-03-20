import React from "react";
import { RHFSelect } from "src/components/hook-form";

import useCategoryOptions from "../hooks/useCategoryOptions";

const Category = () => {
  const categories = useCategoryOptions();

  return (
    <RHFSelect name="category_id" label="help_center.form.category">
      <option value="" />
      {categories}
    </RHFSelect>
  );
};

export default Category;
