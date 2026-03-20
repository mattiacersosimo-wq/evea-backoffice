import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useAvailablePayout = () => {
  const [data, setData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get("api/admin/available-payouts");
        const availablePayouts = data.data?.map(({ id, name }) => {
          return { id, name };
        });
        setData(availablePayouts);
      } catch (err) {
        enqueueSnackbar(err.message, { variant: "error" });
      }
    };

    fetchData();
  }, []);

  return data;
};

export default useAvailablePayout;
