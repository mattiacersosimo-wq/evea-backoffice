import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useGetSectionNames = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useState([]);
  const fetchData = async () => {
    try {
      const { status, data } = await axiosInstance.get(
        "/api/admin/brand-get-started-section-names"
      );
      if (status === 200) {
        setState(data.data);
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return state;
};

export default useGetSectionNames;
