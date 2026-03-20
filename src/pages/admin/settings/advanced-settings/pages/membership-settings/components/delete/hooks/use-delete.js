import { useSnackbar } from "notistack";
import { useState } from "react";
import axiosInstance from "src/utils/axios";

const useDelete = (id, onSuccess) => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const onDelete = async () => {
    setLoading(true);
    const reqData = new FormData();

    reqData.append("_method", "DELETE");

    try {
      const { data } = await axiosInstance.post(
        `api/admin/registration-settings/${id}`,
        reqData
      );
      setLoading(false);
      enqueueSnackbar(data.message);
      onSuccess();
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return { onDelete, loading };
};

export default useDelete;
