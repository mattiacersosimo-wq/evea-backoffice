import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { PATH_DASHBOARD } from "src/routes/paths";

import moment from "moment";
import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";
import genReqData from "../../utils/genReqData";

const NewProductSchema = Yup.object().shape({
  // product_id: Yup.array().when("access_scope", {
  //   is: (access_scope) => access_scope === `Private`,
  //   then: Yup.array()
  //     .min(1, "errors.events.product_id.min")
  //     .required("errors.events.product_id.required"),
  // }),
  event_type: Yup.string().required("errors.events.event_type.required"),
  location_url: Yup.string().required("errors.events.location_url.required"),
  description: Yup.string().required("errors.events.description.required"),
  time: Yup.string().required("errors.events.time.required"),
  hr: Yup.string().required("errors.events.hr.required"),
  min: Yup.string().required("errors.events.min.required"),
  timezone: Yup.string().required("errors.events.timezone.required"),
  host: Yup.string().required("errors.events.host.required"),
  topic: Yup.string().required("errors.events.topic.required"),
  date: Yup.string().transform((v) => serializeDate(v)),
  zoom_password: Yup.string().when("event_type", {
    is: (event_type) => event_type === `webinar`,
    then: Yup.string().required("errors.events.zoom_password.required"),
  }),
});

const defaultValues = {
  // product_id: [],
  event_type: "",
  description: "",
  location_url: "",
  zoom_password: "",
  time: "",
  hr: "",
  min: "",
  timezone: "",
  host: "",
  topic: "",
  image: [],
  // access_scope: "Private",
  date: new Date(),
  time: "00:00",
};

const useAddEvent = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(NewProductSchema),
  });

  const onSubmit = async (formData) => {
    try {
      const { status, data } = await axiosInstance.post(
        "/api/admin/events",
        genReqData(formData)
      );
      if (status === 200) {
        methods.reset();
        enqueueSnackbar(data.message);
        navigate(PATH_DASHBOARD.store.events);
      }
      enqueueSnackbar(data.message, { variant: "error" });
    } catch (error) {
      enqueueSnackbar("Failed to add event", { variant: "error" });
      console.error(error);
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useAddEvent;
