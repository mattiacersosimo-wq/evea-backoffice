import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import useQueryParams from "src/hooks/useQueryParams";

const defaultValues = {
  keyword: null,
  category_id: null,
  product_id: null,
};

const useFilterForm = () => {
  const { queryObject } = useQueryParams();
  const { category_id } = queryObject;
  const methods = useForm({
    defaultValues,
  });

  const { setValue } = methods;

  const { id } = useParams();

  useEffect(() => {
    if (category_id) setValue("category_id", parseInt(category_id));
    return () => {
      methods.reset();
    };
  }, [category_id]);

  useEffect(() => {
    if (id) {
      setValue("product_id", parseInt(id));
    }
  }, [id]);

  return methods;
};

export default useFilterForm;
