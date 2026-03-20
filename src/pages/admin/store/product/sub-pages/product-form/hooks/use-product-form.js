import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useIsPackage from "src/components/package-or-product/hooks/use-is-package";
import useQueryParams from "src/hooks/useQueryParams";
import getThreeYearsFromNow from "src/utils/getThreeYearsFromNow";
import { baseSchema } from "../../../hook/schemas";

const defaultValues = {
  name: "",
  meta_keywords: "",
  product_category_id: "",
  meta_description: "",
  short_description: "",
  product_description: "",
  // bv_percentage: "",
  business_volume: "",
  euro_value: "",
  qualification_value: "",
  title: "",
  product_url: "",
  life_time_access: 0,
  image: [],
  doc: [],
  sample_doc: [],
  video: "",
  active: 1,
  subscription_type: "one-off-payment",
  available_from: moment(),
  available_to: getThreeYearsFromNow(),
  // payment_types: [],
  life_time_business_volume: "",
  life_time_price: "",
  no_of_days: "",
  deleted_image_ids: [],
  image_with_ids: [],
  is_package: 0,
  price: { 1: "" },
};

const useProductForm = () => {
  const { queryObject } = useQueryParams();
  const isPackage = useIsPackage();

  const { type } = queryObject;
  const methods = useForm({
    resolver: yupResolver(baseSchema),
    defaultValues,
  });

  const { setValue } = methods;
  useEffect(() => {
    if (isPackage) {
      setValue("is_package", 1);
      setValue("price", "");
      setValue("video", null);
      setValue("doc", null);
      setValue("sample_doc", null);
      setValue("subscription_type", 0);
    }
  }, [type]);

  return methods;
};

export default useProductForm;
