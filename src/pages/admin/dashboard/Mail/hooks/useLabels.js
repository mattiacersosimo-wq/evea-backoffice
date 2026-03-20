import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useLabels = (URL) => {
  const [labels, setLabels] = useState([]);
  const handleErrors = useErrors();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance.get(URL);
        if (status === 200) {
          setLabels(data.data);
        }
      } catch (err) {
        handleErrors(err);
      }
    };
    fetchData();
  }, []);

  return labels;
};

export const useUserLabels = () => useLabels("api/user/mail-user/labels");

export default useLabels;
