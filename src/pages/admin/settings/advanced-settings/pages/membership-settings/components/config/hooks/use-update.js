import { useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "src/utils/axios";

const useUpdate = () => {
  const methods = useForm({
    defaultValues: {
      age_restriction: { value: "", status: 0 },
      username_dynamic: { value: "", status: 0 },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get("api/admin/config-membership");
        const parsedData = data?.data?.reduce(
          (acc, { code, status, value }) => {
            return { ...acc, [code]: { value, status } };
          },
          {}
        );

        methods.reset(parsedData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return methods;
};

export default useUpdate;
