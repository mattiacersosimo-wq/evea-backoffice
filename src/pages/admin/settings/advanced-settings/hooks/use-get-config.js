import { useSnackbar } from "notistack";
import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import useUpdateConfigMethods from "./use-update-config-methods";

const useGetConfig = (key = "") => {
  const methods = useUpdateConfigMethods();

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get("api/admin/config-settings");
        const { code, value, status } =
          data?.data?.find(({ code }) => code === key) || {};
        methods.reset({ code, value, status });
      } catch (err) {
        enqueueSnackbar(err.message);
      }
    };
    fetchData();
  }, []);

  return methods;
};

export default useGetConfig;
