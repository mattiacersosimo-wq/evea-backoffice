import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useForm } from "react-hook-form";
import { number, object } from "yup";

const schema = object().shape({
  month: number().nullable(),
  year: number().nullable(),
});

export const defaultReportFilter = {
  month: moment().month() + 1, // 1..12
  year: moment().year(),
  user_id: null,
  status: "",
  payment_type: "",
  wallet_type: "",
  bonus_type: "all",
};

const useFilter = () => {
  const methods = useForm({
    defaultValues: defaultReportFilter,
    resolver: yupResolver(schema),
  });

  return methods;
};

export const verifyInput = async (data = {}) => {
  try {
    return await schema.validate(data);
  } catch (err) {
    /* console.log */ // (err);
  }
};
export default useFilter;
