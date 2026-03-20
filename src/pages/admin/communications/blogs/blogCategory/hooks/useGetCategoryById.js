import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "src/utils/axios";
import { object, string } from "yup";

const defaultValues = {
  name: "",
  description: "",
};

const schema = object().shape({
  name: string().required("errors.blogs.categories.name.required"),
  description: string().required("errors.blogs.categories.desc.required"),
});
const useGetCategoryById = (id) => {
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance.get(
          `/api/admin/blog-categories/${id}`
        );
        const { name, description } = data.data;
        if (status === 200) {
          methods.reset({
            name,
            description,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (id) fetchData();
  }, [id]);
  return methods;
};

export default useGetCategoryById;
