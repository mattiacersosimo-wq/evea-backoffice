import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import useMaterialForm from "./useMaterialForm";

const genReqData = (inputData) => {
  const {
    video_access_time,
    product_list,
    doc,
    doc_access_time,
    video,
    video_title,
    rank_value,
    doc_title,
    option_type,
    option_value,
    ...rest
  } = inputData;
  const reqData = new FormData();
  Object.entries(rest).forEach(([key, value]) => reqData.append(key, value));

  reqData.append("option_type", option_type);
  if (Boolean(doc.length)) {
    reqData.append("doc", doc[0]);
    reqData.append("doc_title", doc_title);
    reqData.append("doc_access_time", doc_access_time);
  }
  if (video) {
    reqData.append("video", video);
    reqData.append("video_title", video_title);
    reqData.append("video_access_time", video_access_time);
  }
  if (option_value) {
    reqData.append("option_value", option_value);
  }
  if (option_type === "rank") {
    reqData.append("option_value", rank_value);
  }
  product_list.forEach(({ id }) => reqData.append("product_id[]", id));

  return reqData;
};

const useMaterialsAdd = () => {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useMaterialForm();
  const navigate = useNavigate();
  const onSubmit = async (inputData) => {
    try {
      const { status, data } = await axiosInstance.post(
        "/api/admin/materials",
        genReqData(inputData)
      );

      if (status === 200) {
        enqueueSnackbar(data.message);
        navigate(PATH_DASHBOARD.store.material);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useMaterialsAdd;
