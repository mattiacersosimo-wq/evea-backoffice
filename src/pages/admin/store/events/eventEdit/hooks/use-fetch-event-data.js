import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";
import * as Yup from "yup";

const schema = Yup.object().shape({
  description: Yup.string().required("Description is required"),
  image: Yup.array().min(1, "Image is required"),
  price: Yup.number().moreThan(0, "Price should not be $0.00"),
  date: Yup.string()
    .test("is-valid", "errors.date.valid_date.test", (v) =>
      moment(v, "DD/MM/YYYY").isValid()
    )
    .transform((v) => serializeDate(v)),
});

const defaultValues = {
  image: [],
  event_type: "",
  zoom_password: "",
  location_url: "",
  timezone: "",
  topic: "",
  host: "",
  hr: "",
  min: "",
  time: "",
  date: "",
};

const useFetchEventData = () => {
  const { eid } = useParams();
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const { status, data } = await axiosInstance.get(
          `api/admin/events/${id}`
        );
        const {
          date,
          time,
          duration,
          image,
          event_type,
          zoom_password,
          location_url,
          timezone,
          topic,
          host,

          description,
        } = data.data;

        const [hr, min] = duration.split(":");
        if (status === 200)
          methods.reset({
            image: [image],
            event_type,
            zoom_password,
            description,
            location_url,
            timezone,
            topic,
            host,
            hr,
            min,
            date: moment(date),
            time,
          });
      } catch (err) {
        console.log(err);
      }
    };
    if (eid) fetchData(eid);
  }, [eid]);

  return { methods };
};

export default useFetchEventData;
