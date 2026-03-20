import { useSnackbar } from "notistack";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useUpdate = (fetchData, selectedValue) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleError = useErrors();

  const onSubmit = async (inputData) => {
    const { rank_criteria, ...rest } = inputData;

    const reqData = new FormData();
    reqData.append("_method", "PUT");
    reqData.append("rank_criteria", selectedValue);
    Object.entries(rest).forEach(([k, v]) => {
      reqData.append(k, Number(v));
    });

    try {
      const { status, data } = await axiosInstance.post(
        `/api/admin/settings-rank-configuration `,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
        fetchData();
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return onSubmit;
};

export default useUpdate;
