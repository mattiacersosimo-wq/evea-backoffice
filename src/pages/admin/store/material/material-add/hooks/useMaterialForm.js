import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useForm } from "react-hook-form";
import serializeDate from "src/utils/serialize-date";
import * as yup from "yup";

export const UrlSchema = /^(https?:\/\/)?(www\.)?(vimeo\.com\/)(\d+)/;

const acceptedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

const schema = yup.object().shape({
  product_list: yup.array().min(1, "errors.material.product_list.min"),
  category_id: yup.string().required("errors.material.category_id.required"),

  video: yup.string().when("doc", {
    is: (val) => !val || val.length === 0,
    then: yup
      .string()
      .matches(UrlSchema, "errors.material.video.matches")
      .url("errors.material.url.matches")
      .required(),
    otherwise: yup.string().url("errors.material.url.matches").notRequired(),
  }),

  video_title: yup.string().when("video", {
    is: (val) => val,
    then: yup.string().required("errors.material.video_title.required"),
  }),
  video_access_time: yup.string().when("video", {
    is: (val) => val,
    then: yup
      .string()
      .required("errors.material.video_title.required")
      .test("is-valid", "errors.material.video_title.test", (v) =>
        moment(v, "DD/MM/YYYY").isValid()
      )
      .transform((v) => serializeDate(v))
      .typeError("errors.material.video_title.type"),
    otherwise: yup.string().nullable(),
  }),

  doc: yup
    .mixed()
    .test("file-exist", "errors.material.doc.test", (v, ctx) => {
      if (Boolean(ctx.parent.video)) {
        return true;
      }
      return Boolean(v.length);
    })
    .test(
      "file-type",
      "Only .pdf, .xls, .xlsx file type are accepted",
      (v, ctx) => {
        if (Boolean(ctx.parent.video)) {
          return true;
        }
        if (Boolean(v)) {
          return acceptedTypes.includes(v[0]?.type);
        }
      }
    ),
  doc_title: yup.string().when("doc", {
    is: (val) => Boolean(val.length),
    then: yup.string().required("errors.material.doc_title.required"),
  }),

  doc_access_time: yup.string().when("doc", {
    is: (val) => Boolean(val.length),
    then: yup
      .string()
      .required("errors.material.doc_access_time.required")
      .test("is-valid", "errors.material.doc_access_time.test", (v) =>
        moment(v, "DD/MM/YYYY").isValid()
      )
      .transform((v) => serializeDate(v))
      .typeError("errors.material.doc_access_time.type"),
    otherwise: yup.string().nullable(),
  }),
  user_id: yup.string().when("option_type", {
    is: "single",
    then: yup.string().required("errors.material.user_id.required"),
  }),
  option_value: yup.string().when("option_type", {
    is: "product",
    then: yup.string().required("errors.material.option_value.required"),
  }),
  rank_value: yup.string().when("option_type", {
    is: "rank",
    then: yup.string().required("errors.material.rank_value.required"),
  }),
});

const defaultValues = {
  product_list: [],
  // active: 1,
  name: "material",
  category_id: "",
  description: "",
  doc: [],
  video: "",
  video_title: "",
  video_access_time: moment().add(1, "y"),
  doc_title: "",
  doc_access_time: moment().add(1, "y"),
  option_type: "all_users",
};
const useMaterialForm = () => {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  return methods;
};

export default useMaterialForm;
