import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";
import { object, string } from "yup";

const defaultValues = {
  active: 1,
  category_id: "",
  date: "",
  note: "",
  _method: "PUT",
  user_id: "",
  product_id: "",
};

const schema = object().shape({
  date: string()
    .test("is-valid", "errors.date.valid_date.test", (v) => {
      if (v) return moment(v, "DD/MM/YYYY").isValid();
      return true;
    })
    .transform((v) => serializeDate(v))
    .nullable(),

  effective_until: string()
    .test("is-valid", "errors.date.valid_date.test", (v) => {
      if (v) return moment(v, "DD/MM/YYYY").isValid();
      return true;
    })
    .transform((v) => serializeDate(v))
    .nullable(),
});

const useGetSubscriptionById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const fetchSubScriptionById = async (subscriptionId) => {
    try {
      const { status, data } = await axiosInstance.get(
        `api/admin/product-subscriptions/${subscriptionId}`
      );
      if (status === 200) {
        const {
          created_at,
          active,
          user_id,
          product_id,
          effective_until,
          user_purchase,
        } = data.data;

        methods.reset({
          effective_until,
          user_id: user_id ? user_id : null,
          product_id,
          note: user_purchase.note,
          category_id: user_purchase?.product_subscription_category?.id,
          date: user_purchase?.date,
          active,
        });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return { methods, fetchSubScriptionById };
};

export default useGetSubscriptionById;
