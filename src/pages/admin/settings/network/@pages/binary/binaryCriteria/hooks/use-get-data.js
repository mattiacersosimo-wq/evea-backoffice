import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const defaultValues = {
  period: "daily",
};

const useGetData = () => {
  const methods = useForm({
    defaultValues,
  });
  const handleError = useErrors();

  const fetchData = async () => {
    try {
      const { status, data } = await axiosInstance("/api/admin/binary-period");
      if (status === 200) {
        const { period } = data?.data[0];
        methods.reset({
          period,
        });
      }
    } catch (err) {
      handleError(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return { methods, fetchData };
};

export default useGetData;
