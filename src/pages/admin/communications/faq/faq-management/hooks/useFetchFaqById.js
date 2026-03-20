import { useEffect } from "react";
import axiosInstance from "src/utils/axios";
import useFaqForm from "./useFaqForm";

const useFetchFaqById = (id) => {
  const methods = useFaqForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(`api/admin/faq/${id}`);
        if (status === 200) {
          const { answer, question, category_id, active } = data.data;
          methods.reset({ answer, question, category_id, active });
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (id) fetchData();
  }, [id]);

  return methods;
};

export default useFetchFaqById;
