import createProductCategory from "src/api/admin/products/product-category/create";
import getProductCategoryList from "src/api/admin/products/product-category/ist";
import AutoComplete from "src/components/auto-complete";

const ProductCategory = () => {
  return (
    <AutoComplete
      fetchData={getProductCategoryList}
      name="product_category_id"
      createMode
      optionLabel={({ name }) => name}
      textFieldProps={{
        defaultValues: { active: 1, name: "" },
        addKey: "name",
        createFunction: createProductCategory,
      }}
    />
  );
};

export default ProductCategory;
