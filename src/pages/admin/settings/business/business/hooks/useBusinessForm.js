import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const Index = Yup.object().shape({
  name: Yup.string().required(" Name is required"),
  amount: Yup.number()
    .typeError("Amount is required")
    .positive()
    .required("Amount is required"),
  bv: Yup.number()
    .typeError("BV must be a number")
    .positive()
    .required("BV is required"),
});

const defaultValues = {
  name: "",
  amount: "",
  bv: "",
};

const useCategoriesForm = () => {
  return useForm({
    resolver: yupResolver(Index),
    defaultValues,
  });
};

export default useCategoriesForm;
