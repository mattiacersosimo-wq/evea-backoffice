import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import useGuidanceForm, { guidanceDefaultValues } from "./useGuidanceForm";

const useAddGuidance = (fetchData) => {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useGuidanceForm();

  const onSubmit = async (inputData) => {
    const formData = new FormData();
    [...Object.entries(inputData)].forEach(([key, value]) =>
      formData.append(key, value)
    );

    try {
      const { status, data } = await axiosInstance.post(
        "/api/admin/brand-user-guidances",
        formData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        fetchData();
        methods.reset(guidanceDefaultValues);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useAddGuidance;
