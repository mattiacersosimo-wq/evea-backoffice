import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import URI from "src/utils/urlConfig";
import usePagination from "src/components/pagination/usePagination";

const useStair = () => {
  const [state, actions] = useDataHandler();
  const { enqueueSnackbar } = useSnackbar();
  const { data } = state;
  const handleError = useErrors();
  const { rowStart } = usePagination();

  useEffect(() => {
    actions.loading();
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          URI.admin.settings.network.stair.index
        );
        if (status === 200) {
          const { data: list } = data;
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
        `api/admin/stair-step`,
        reqData
      );
      if (status === 200) {
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  return { state, handleUpdate, onSubmit, rowStart };
};

export default useStair;
