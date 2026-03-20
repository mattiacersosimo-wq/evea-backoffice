import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";
import * as Yup from "yup";

const Index = Yup.object().shape({
  user_id: Yup.string()
    .required("Member is required")
    .typeError("Member is required"),
});

const defaultValues = {
  user_id: "",
};
const useUpdateOwner = (cb) => {
  const methods = useForm({ resolver: yupResolver(Index), defaultValues });
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit } = methods;
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    reqData.append("_method", "PUT");

    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );

    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/support-tickets-change-owner/${id}`,
        reqData
      );

      if (status === 200) {
        cb(id);

        enqueueSnackbar(data.message);
      }
    } catch (err) {
      Object.values(err).flatMap((item) =>
        enqueueSnackbar(item, { variant: "error" })
      );
    }
  };

  return { methods, onSubmit: handleSubmit(onSubmit) };
};

export default useUpdateOwner;
