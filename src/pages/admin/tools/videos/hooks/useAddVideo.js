import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { UrlSchema } from "src/pages/admin/store/material/material-add/hooks/useMaterialForm";
import axiosInstance from "src/utils/axios";

import * as yup from "yup";

const Validator = yup.object().shape({
  title: yup.string().required("errors.tools.video.title.required"),
  video_tool_url: yup
    .string()
    .required("errors.tools.video.video_tool_url.required")
    .matches(UrlSchema, "errors.tools.video.video_tool_url.matches"),
});

const defaultValues = {
  video_tool_url: "",
  title: "",
};
const getRequestData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));
  return formData;
};

const useAddVideo = (cb = () => null) => {
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(Validator),
  });

  const onSubmit = async (reqData) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/admin/tool-videos`,
        getRequestData(reqData)
      );
      if (data.status) {
        enqueueSnackbar(data.message);
        methods.reset();
        cb();
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to add video", { variant: "error" });
    }
  };

  return { methods, onSubmit };
};

export default useAddVideo;
