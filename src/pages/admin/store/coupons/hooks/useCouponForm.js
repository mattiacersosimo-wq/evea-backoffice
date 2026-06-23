import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import moment from "moment";
import serializeDate from "src/utils/serialize-date";

const CouponAddSchema = Yup.object().shape({
  name: Yup.string().required("errors.coupons.name.required"),
  code: Yup.string()
    .transform((d) => d.replace(/\s+/g, ""))
    .matches(/^[\w-]*$/, "errors.coupons.code.matches")
    .required("errors.coupons.code.required"),

  type: Yup.string().required("errors.coupons.type.required"),
  discount: Yup.number().when("type", {
    is: (v) => {
      return v === "percentage";
    },
    then: (schema) => {
      return schema.test((v) => {
        if (v === 100) {
          return schema
            .typeError("errors.coupons.discount.type")
            .min(0, "errors.coupons.discount.min")
            .max(100, "errors.coupons.discount.max")
            .required("errors.coupons.discount.required");
        }
        return schema
          .typeError("errors.coupons.discount.type")
          .min(0, "errors.coupons.discount.min")
          .max(Yup.ref("total_amount"), "errors.coupons.discount.maxi")
          .required("errors.coupons.discount.required");
      });
    },
    otherwise: (schema) =>
      schema
        .typeError("errors.coupons.discount.type")
        .min(0, "errors.coupons.discount.min")
        .max(Yup.ref("total_amount"), "errors.coupons.discount.maxi")
        .required("errors.coupons.discount.required"),
  }),
  total_amount: Yup.number()
    .typeError("errors.coupons.total_amount.type")
    .min(0, "errors.coupons.total_amount.min")
    .required("errors.coupons.total_amount.required"),
  uses_per_coupon: Yup.number()
    .integer("errors.coupons.uses_per_coupon.integer")
    .min(1, "errors.coupons.uses_per_coupon.min")
    .required("errors.coupons.uses_per_coupon.required")
    .typeError("errors.coupons.uses_per_coupon.type"),
  uses_per_customer: Yup.number()
    .integer("errors.coupons.uses_per_customer.integer")
    .min(1, "errors.coupons.uses_per_customer.min")
    .max(Yup.ref("uses_per_coupon"), `errors.coupons.uses_per_customer.max`)
    .required("errors.coupons.uses_per_customer.required")
    .typeError("errors.coupons.uses_per_customer.type"),

  start_date: Yup.string()
    .test("is-valid", "errors.coupons.start_date.test", (v) =>
      moment(v, "DD/MM/YYYY").isValid()
    )
    .test("is-valid", "errors.coupons.start_date.valid", (v, ctx) => {
      if (v === null) return true;
      if (ctx.parent.end_date === null) return true;
      return (
        moment(ctx.parent.end_date, "DD/MM/YYYY").diff(
          moment(v, "DD/MM/YYYY")
        ) > 0
      );
    })
    .transform((v) => serializeDate(v))
    .nullable(),
  end_date: Yup.string()
    .test("is-valid", "errors.coupons.end_date.test", (v) =>
      moment(v, "DD/MM/YYYY").isValid()
    )
    .test("is-valid", "errors.coupons.end_date.valid", (v, ctx) => {
      if (v === null) return true;
      if (ctx.parent.start_date === null) return true;
      return (
        moment(ctx.parent.start_date, "DD/MM/YYYY").diff(
          moment(v, "DD/MM/YYYY")
        ) < 0
      );
    })
    .transform((v) => serializeDate(v))
    .nullable(),
});

const defaultValues = {
  product_id: [],
  name: "",
  code: "",
  type: "",
  discount: "",
  total_amount: "",
  uses_per_coupon: "",
  uses_per_customer: "",
  start_date: moment(),
  end_date: moment().add(1, "day"),
  active: 1,
};

const useCouponForm = () => {
  return useForm({
    resolver: yupResolver(CouponAddSchema),
    defaultValues,
  });
};

export default useCouponForm;
