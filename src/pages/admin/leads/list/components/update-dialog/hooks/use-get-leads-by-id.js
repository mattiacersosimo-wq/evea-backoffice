import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { leadSchema } from "src/pages/lead/register";
import axiosInstance from "src/utils/axios";

const useGetLeadsById = (open) => {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    resolver: yupResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
    },
  });

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const { data } = await axiosInstance.get(
          `api/admin/lead-capture/${id}`
        );
        const { status, data: lead } = data;
        if (status) {
          const { email, name, mobile } = lead;
          methods.reset({
            email,
            name,
            mobile,
          });
        }
      } catch (err) {
        enqueueSnackbar(err.message, { variant: "error" });
        console.log(err);
      }
    };
    if (open) {
      fetchData(open);
    }
  }, [open]);

  return methods;
};

export default useGetLeadsById;
