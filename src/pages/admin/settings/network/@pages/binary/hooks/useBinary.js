import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import URI from "src/utils/urlConfig";

const useBinary = () => {
  const [state, actions] = useDataHandler();
  const [loading, setLoading] = useState(false);
  const { data } = state;
  const { enqueueSnackbar } = useSnackbar();

  const handleError = useErrors();
  useEffect(() => {
    actions.loading();
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          URI.admin.settings.network.binary.index
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
    setLoading(true);
    const reqData = new FormData();
    const datass = JSON.stringify(data);
    reqData.append("data", datass);
    try {
      const { status, data } = await axiosInstance.post(
        `api/admin/binarysettings`,
        reqData
      );
      setLoading(false);
      if (status === 200) {
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      setLoading(false);
      handleError(err);
    }
  };

  return { state, handleUpdate, onSubmit, loading };
};
export default useBinary;
