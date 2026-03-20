import { paramCase } from "change-case";
import moment from "moment";
import serializeDate from "src/utils/serialize-date";
import { mixed, number, object, string } from "yup";

export const baseSchema = object().shape({
  name: string().required("errors.products.add.product_name.required"),
  product_description: string()
    .transform((v) => v.replace(/<p><br><\/p>/g, ""))
    .required("errors.products.add.product_description.required"),
  active: string().required("errors.products.add.active.required"),
  // meta_description: string().required(
  //   "errors.products.add.meta_description.required"
  // ),
  product_category_id: string()
    .required("errors.products.add.product_category_id.required")
    .typeError("errors.products.add.product_category_id.type"),
  // title: string().required("errors.products.add.title.required"),
  // meta_keywords: string().required(
  //   "errors.products.add.meta_keywords.required"
  // ),
  subscription_type: string().transform((v) => {
    const transformedValue = v === "subscription" ? 1 : 0;
    return transformedValue.toString();
  }),

  // bv_percentage: string().when("is_package", {
  //   is: (v) => v === 0,
  //   then: (schema) =>
  //     schema
  //       .required("errors.products.add.bv_percentage.required")
  //       .typeError("errors.products.add.bv_percentage.type")
  //       .test("is-valid", "errors.products.add.bv_percentage.test", (v) => {
  //         if (Boolean(v)) {
  //           const parsed = parseInt(v);
  //           if (parsed >= 0 && parsed <= 100) return true;
  //           return false;
  //         }
  //         return false;
  //       })
  //       .nullable(),
  // }),
  euro_value: string().when("is_package", {
    is: (v) => v === 0,
    then: (schema) =>
      schema
        .required("errors.products.add.euro_value.required")
        .typeError("errors.products.add.euro_value.type")
        .nullable(),
  }),
  qualification_value: string().when("is_package", {
    is: (v) => v === 0,
    then: (schema) =>
      schema
        .required("errors.products.add.qualification_value.required")
        .typeError("errors.products.add.qualification_value.type")
        .nullable(),
  }),
  business_volume: string().when("is_package", {
    is: (v) => v === 0,
    then: (schema) =>
      schema
        .required("errors.products.add.business_volume.required")
        .typeError("errors.products.add.business_volume.type")
        .nullable(),
  }),
  product_url: string()
    .required("errors.products.add.product_url.required")
    .transform((v) => paramCase(v))
    .nullable(),

  video: string().url("errors.products.add.video.required").nullable(),
  image: mixed().test("isFile", "errors.products.add.image.test", (value) =>
    Boolean(value.length),
  ),

  // doc: mixed().when("is_package", {
  //   is: (v) => v === 0,
  //   then: (schema) =>
  //     schema
  //       .test("isFile", "errors.products.add.doc.test", (value) =>
  //         Boolean(value?.length)
  //       )
  //       .nullable(),
  // }),
  // sample_doc: mixed().when("is_package", {
  //   is: (v) => v === 0,
  //   then: (schema) =>
  //     schema
  //       .test("isFile", "errors.products.add.sample_doc.test", (value) =>
  //         Boolean(value?.length)
  //       )
  //       .nullable(),
  // }),
  available_from: string()
    .test("is-valid", "errors.date.valid_date.test", (v) =>
      moment(v, "YYYY/MM/DD").isValid(),
    )
    .test("is-valid", "errors.date.valid_start.test", (v, ctx) => {
      if (v === null) return true;
      if (ctx.parent.available_to === null) return true;
      return (
        moment(ctx.parent.available_to, "YYYY/MM/DD").diff(
          moment(v, "YYYY/MM/DD"),
        ) > 0
      );
    })
    .transform((v) => serializeDate(v))
    .nullable(),
  available_to: string()
    .test("is-valid", "errors.date.valid_date.test", (v) =>
      moment(v, "YYYY/MM/DD").isValid(),
    )
    .test("is-valid", "errors.date.valid_end.test", (v, ctx) => {
      if (v === null) return true;
      if (ctx.parent.available_from === null) return true;
      return (
        moment(ctx.parent.available_from, "YYYY/MM/DD").diff(
          moment(v, "YYYY/MM/DD"),
        ) < 0
      );
    })
    .transform((v) => serializeDate(v))
    .nullable(),

  price: mixed().when("is_package", {
    is: (v) => v === 0,
    then: (schema) =>
      schema
        .test("is-filled", "errors.products.add.price.required", (v) =>
          Object.values(v).reduce((acc, curr) => acc && Boolean(curr), true),
        )
        .test("is-valid", "You Cannot input this number as price", (v) =>
          Object.values(v).reduce((acc, curr) => {
            if (curr < 10000000000) {
              return true;
            }
            return acc && false;
          }, true),
        ),
    otherwise: () =>
      number()
        .required("errors.products.add.price.required")
        .typeError("errors.products.add.price.typeError")
        .min(1, " errors.products.add.price.min"),
  }),
});

export { baseSchema as EditProductSchema };
