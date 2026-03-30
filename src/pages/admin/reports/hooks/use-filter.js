import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useForm } from "react-hook-form";
import serializeDate from "src/utils/serialize-date";
import { object, string } from "yup";

const schema = object().shape({
  start_date: string()
    .test("is-valid", "errors.date.valid_date.test", (v) => {
      if (v === null) return true;
      return moment(v, "YYYY/MM/DD").isValid();
    })
    .test("is-valid", "errors.date.valid_start.test", (v, ctx) => {
      if (v === null) return true;
      if (ctx.parent.end_date === null) return true;
      return (
        moment(ctx.parent.end_date, "YYYY/MM/DD").diff(
          moment(v, "YYYY/MM/DD")
        ) > 0
      );
    })
    .transform((v) => serializeDate(v))
    .nullable(),
  end_date: string()
    .test("is-valid", "errors.date.valid_date.test", (v) => {
      if (v === null) return true;
      return moment(v, "YYYY/MM/DD").isValid();
    })
    .test("is-valid", "errors.date.valid_end.test", (v, ctx) => {
      if (v === null) return true;
      if (ctx.parent.start_date === null) return true;
      return (
        moment(ctx.parent.start_date, "YYYY/MM/DD").diff(
          moment(v, "YYYY/MM/DD")
        ) < 0
      );
    })
    .transform((v) => serializeDate(v))
    .nullable(),
});

export const defaultReportFilter = {
  start_date: moment().startOf("month"),
  end_date: moment().endOf("month"),
  user_id: null,
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
    console.log(err);
  }
};
export default useFilter;
