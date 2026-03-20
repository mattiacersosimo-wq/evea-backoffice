import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import createMaterialCategory from "src/api/admin/material/category/create";
import getMaterialCategoryList from "src/api/admin/material/category/list";
import AutoComplete from "src/components/auto-complete";

const Category = () => {
  const {
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  return (
    <AutoComplete
      fetchData={async () =>
        await getMaterialCategoryList({ active: 1, type: "product" })
      }
      name="category_id"
      createMode
      optionLabel={({ name }) => name}
      textFieldProps={{
        defaultValues: { sort_order: 1, name: "", active: 1, type: "product" },
        addKey: "name",
        label: t("material.add_material.material_category"),
        createFunction: createMaterialCategory,
        errorMessage: t(errors.category_id?.message),
      }}
    />
  );
};

export default Category;
