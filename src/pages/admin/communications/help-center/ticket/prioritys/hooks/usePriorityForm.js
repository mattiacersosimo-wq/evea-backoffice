import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

const PrioritySchema = Yup.object().shape({
  name: Yup.string().required("errors.help_center.priorities.name.required"),
  description: Yup.string().required(
    "errors.help_center.priorities.description.required"
  ),
  color: Yup.string().required("errors.help_center.priorities.color.required"),
});

const defaultValues = {
  name: "",
  description: "",
  sort_order: 1,
  active: 1,
  color: "",
};

const usePriorityForm = () => {
  const methods = useForm({
    resolver: yupResolver(PrioritySchema),
    defaultValues,
  });
  useEffect(
    () => () => {
      methods.reset(defaultValues);
    },
    []
  );
  return methods;
};

export default usePriorityForm;
