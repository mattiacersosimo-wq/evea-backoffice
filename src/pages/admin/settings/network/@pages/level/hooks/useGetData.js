import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
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
          "/api/admin/level-settings"
        );
        if (status === 200) {
          const { data: list } = data.data;
          if (Boolean(list.length)) {
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
    const selectedItem = data.find((item) => id === item.id);
    const { value, name } = e.target;
    selectedItem[name] = value;
    const prev = [...data];

    const temp = [...prev];
    temp.splice(selectedIndex, 1, selectedItem);
    actions.success(temp);
    // setData((prev) => {
    //   const temp = [...prev];
    //   temp.splice(selectedIndex, 1, selectedItem);
    //   return temp;
    // });
  };

  const onSubmit = async () => {
    const reqData = new FormData();
    const datass = JSON.stringify(data);
    reqData.append("data", datass);
    try {
      const { status, data } = await axiosInstance.post(
        `api/admin/level-settings`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  return { state, handleUpdate, onSubmit };
};
export default useGetData;
