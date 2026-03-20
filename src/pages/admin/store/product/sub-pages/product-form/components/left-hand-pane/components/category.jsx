import { RHFSelect } from "src/components/hook-form";
import Map from "src/components/map";

import { trim } from "../../../../../../productCategories/Components/ProductCategory";
import useProductCategory from "../../../hooks/use-product-category";

const Category = () => {
  const data = useProductCategory();
  return (
    <RHFSelect
      InputLabelProps={{
        shrink: true,
      }}
      name="product_category_id"
      label={"adminStore.products.productCategory"}
    >
      <option
        value=""
        style={{
          color: "grey",
        }}
      >
        --Choose Product Category--
      </option>
      <Map
        list={data}
        render={(item) => <option value={item.id}>{trim(item.name)}</option>}
      />
    </RHFSelect>
  );
};

export default Category;
