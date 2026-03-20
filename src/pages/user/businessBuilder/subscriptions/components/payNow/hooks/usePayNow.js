import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";
import usePayNowForm from "./usePayNowForm";

const usePayNow = () => {
  const { methods, reset } = usePayNowForm();
  const handleErrors = useErrors();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([key, value]) =>
      reqData.append(key, value)
    );

    try {
      const { status, message } = await (
        await fetchUser.post("bb-subscriptions", reqData)
      ).data;
      if (status) {
        enqueueSnackbar(message);
        reset();
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default usePayNow;
