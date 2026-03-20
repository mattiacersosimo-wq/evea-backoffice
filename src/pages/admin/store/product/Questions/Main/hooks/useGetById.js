import { useSnackbar } from "notistack";
import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import useQuestionForm from "./useQuestionForm";

const useGetQuestionById = (id) => {
  const methods = useQuestionForm();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          `/api/admin/product-question-show/${id}`
        );
        if (status === 200) {
          const { title, description } = data.data;
          methods.reset({
            title,
            description,
          });
        }
      } catch (err) {
        Object.values(err).flatMap((item) =>
          enqueueSnackbar(item, { variant: "error" })
        );
      }
    };

    if (id) fetchData();
  }, [id]);

  return methods;
};

export default useGetQuestionById;
