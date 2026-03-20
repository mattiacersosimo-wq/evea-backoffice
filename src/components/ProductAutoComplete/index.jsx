import { Autocomplete, Chip, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

import useAdminGroupsList from "./hooks/useAdminGroupsList";
import useDepartmentList from "./hooks/useDepartmentList";
import useProductList from "./hooks/useProductList";
import { useTranslation } from "react-i18next";

const ProductAutoComplete = ({ onChange }) => {
  const productList = useProductList();
  const productId = useFormContext().getValues("product_id");
  const { t } = useTranslation();
  const value = productList.find((v) => v.id === productId);
  if (value)
    return (
      <Autocomplete
        onChange={onChange}
        options={productList}
        value={value}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField label={t("user_review.product")} {...params} />
        )}
      />
    );
  return null;
};

export const MultipleProductAutoComplete = ({ onChange, ...rest }) => {
  const productList = useProductList();
  const { t } = useTranslation();
  return (
    <Autocomplete
      multiple
      onChange={onChange}
      options={productList}
      getOptionLabel={(option) => option.name}
      renderProducts={(value, getProductsProps) =>
        value.map((option, index) => (
          <Chip
            {...getProductsProps({ index })}
            key={option}
            size="small"
            label={option}
          />
        ))
      }
      renderInput={(params) => (
        <TextField label={t("user_review.product")} {...params} {...rest} />
      )}
    />
  );
};

export const MultipleDepartmentAutoComplete = ({ onChange }) => {
  const departmentList = useDepartmentList();
  return (
    <Autocomplete
      multiple
      onChange={onChange}
      options={departmentList}
      getOptionLabel={(option) => option.name}
      renderProducts={(value, getProductsProps) =>
        value.map((option, index) => (
          <Chip
            {...getProductsProps({ index })}
            key={option}
            size="small"
            label={option}
          />
        ))
      }
      renderInput={(params) => <TextField label="Departments" {...params} />}
    />
  );
};

export const AdminGroupListAutoComplete = ({ onChange }) => {
  const adminGroupList = useAdminGroupsList();
  const { getValues } = useFormContext();

  if (adminGroupList.length) {
    const selected = adminGroupList.find(
      ({ id }) => getValues("group_id") === id
    );
    return (
      <Autocomplete
        defaultValue={selected}
        onChange={onChange}
        options={adminGroupList}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField label="Group" {...params} />}
      />
    );
  }

  return null;
};

export default ProductAutoComplete;
