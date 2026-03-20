import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import axiosInstance from "src/utils/axios";

import * as yup from "yup";

const Validator = yup.object().shape({
  notes: yup.string().required("errors.profile.notes.note.required"),
});

const defaultValues = {
  notes: "",
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
        `/api/user/notes`,
        getRequestData(reqData)
      );
      if (data.status) {
        enqueueSnackbar(data.message);
        methods.reset();
        cb();
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to add Notes", { variant: "error" });
    }
  };

  return { methods, onSubmit };
};

export default useAddVideo;
