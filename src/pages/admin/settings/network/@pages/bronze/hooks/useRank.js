import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import URI from "src/utils/urlConfig";
const useRank = () => {
  const [data, setData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const handleError = useErrors();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          URI.admin.settings.network.bronze.index
        );
        if (status === 200) {
          setData(data.data);
        }
      } catch (err) {
        handleError(err);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = (id, e) => {
    const selectedIndex = data.findIndex((item) => item.id === id);
    const selectedItem = data.find((item) => id === item.id);
    const { value } = e.target;
    selectedItem.bonus_amount = value ? parseInt(value) : value;
    setData((prev) => {
      const temp = [...prev];
      temp.splice(selectedIndex, 1, selectedItem);
      return temp;
    });
  };

  const onSubmit = async (id) => {
    const updateData = data.find((item) => item.id === id);
    const reqData = new FormData();

    reqData.append("bonus_amount", updateData.bonus_amount);
    reqData.append("_method", "PUT");
    try {
      const { status, data: resData } = await axiosInstance.post(
        URI.admin.settings.network.bronze.update(id, reqData),
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(resData.message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  return { data, handleUpdate, onSubmit };
};
export default useRank;
