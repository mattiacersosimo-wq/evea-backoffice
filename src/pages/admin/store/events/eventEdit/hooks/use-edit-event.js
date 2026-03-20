import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import useFetchEventData from "./use-fetch-event-data";

const genReqData = (data) => {
  const { hr, min, image, ...rest } = data;
  const reqData = new FormData();

  reqData.append("duration", `${hr}:${min}`);
  reqData.append("img", image[0]);

  [...Object.entries(rest)].forEach(([key, value]) =>
    reqData.append(key, value)
  );

  return reqData;
};

const useEditEvent = () => {
  const navigate = useNavigate();
  const { eid } = useParams();
  const { methods } = useFetchEventData();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (inputData) => {
    delete inputData.end_date;
    delete inputData.duration;
    delete inputData.date_time;
    const reqData = genReqData(inputData);
    reqData.append("_method", "PUT");
    try {
      const { status, data: resData } = await axiosInstance.post(
        `api/admin/events/${eid}`,
        reqData
      );

      if (status === 200) {
        methods.reset();
        enqueueSnackbar(resData.message);
      }
      navigate(PATH_DASHBOARD.store.events);
    } catch (error) {
      console.error(error);
    }
  };

  return { methods, onSubmit };
};

export default useEditEvent;
