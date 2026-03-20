import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useQueryParams from "src/hooks/useQueryParams";

const defaultValues = {
  keyword: null,
  category_id: null,
  product_id: null,
};

const useFilterForm = () => {
  const { queryObject } = useQueryParams();
  const { category_id, id } = queryObject;
  const methods = useForm({
    defaultValues,
  });

  const { setValue } = methods;

  useEffect(() => {
    if (category_id) setValue("category_id", parseInt(category_id));
    if (id) setValue("product_id", parseInt(id));
  }, [category_id]);

  useEffect(() => {
    if (id) {
      setValue("product_id", parseInt(id));
    }
  }, [id]);

  return methods;
};

export default useFilterForm;
