import { useSnackbar } from "notistack";
import { useState } from "react";
import axiosInstance from "src/utils/axios";

const useMaterialDelete = (reset) => {
  const [deleteId, setDeleteId] = useState(null);
  const closeDelete = () => setDeleteId(null);
  const openDelete = (id) => () => setDeleteId(id);
  const { enqueueSnackbar } = useSnackbar();
  const onDelete = (route) => async () => {
    if (deleteId) {
      const URI = `${route}/${deleteId}`;
      const reqData = new FormData();
      reqData.append("_method", "DELETE");
      const { data, status } = await axiosInstance.post(URI, reqData);
      if (status === 200) {
        reset();
        closeDelete();
        enqueueSnackbar(data.message);
      }
    }
  };

  return { deleteId, closeDelete, openDelete, onDelete };
};

export default useMaterialDelete;
