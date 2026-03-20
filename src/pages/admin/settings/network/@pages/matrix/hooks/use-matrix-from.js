import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "src/utils/axios";
import { object, string } from "yup";

const defaultValues = {
  width: 0,
  height: 0,
};

const schema = object().shape({
  width: string().required("Width is required"),
  height: string().required("Height is required"),
});

const useMatrixForm = () => {
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          "api/admin/matrix-settings"
        );
        if (status === 200) {
          const { width, height } = data.data;
          methods.reset({
            width,
            height,
          });
        }
      } catch (err) {}
    };
    fetchData();
  }, []);

  return methods;
};

export default useMatrixForm;
