import { useSnackbar } from "notistack";
import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useGetData = () => {
  const [state, actions] = useDataHandler();
  const { enqueueSnackbar } = useSnackbar();
  const { data } = state;
  const handleError = useErrors();

  useEffect(() => {
    actions.loading();
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          "api/admin/fast_start_bonus_settings"
        );
        if (status === 200) {
          const list = data?.data?.data || data?.data || [];
          if (Array.isArray(list) && list.length > 0) {
            actions.success(list);
            return;
          }
          actions.success();
        }
      } catch (err) {
        actions.error();
        handleError(err);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = (id) => (e) => {
    const selectedIndex = data.findIndex((item) => item.id === id);
    const selectedItem = { ...data.find((item) => id === item.id) };
    const { value, name } = e.target;
    selectedItem[name] = value;
    const temp = [...data];
    temp.splice(selectedIndex, 1, selectedItem);
    actions.success(temp);
  };

  const onSubmit = async () => {
    const reqData = new FormData();
    reqData.append("data", JSON.stringify(data));
    try {
      const { status, data: res } = await axiosInstance.post(
        "api/admin/fast_start_bonus_settings",
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(res.message || "Impostazioni aggiornate");
      }
    } catch (err) {
      handleError(err);
    }
  };

  return { state, handleUpdate, onSubmit };
};

export default useGetData;
