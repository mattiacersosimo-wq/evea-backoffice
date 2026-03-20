import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import URI from "src/utils/urlConfig";

const useUpdateRankSettings = () => {
  const handleErrors = useErrors();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (updateData) => {
    const reqData = new FormData();
    Object.entries(updateData).forEach(([k, v]) =>
      reqData.append(k, v ? v : 0)
    );
    reqData.append("_method", "PUT");
    try {
      const { status, data } = await axiosInstance.post(
        URI.admin.settings.network.rank.update(updateData.id),
        reqData
      );

      if (status === 200) {
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  return onSubmit;
};

export default useUpdateRankSettings;
