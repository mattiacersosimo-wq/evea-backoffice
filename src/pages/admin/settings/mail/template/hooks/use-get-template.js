import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";
import buildPath from "src/utils/build-path";
import useTemplateForm from "./use-template-form";

const useGetTemplate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useTemplateForm();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const { data } = await axiosInstance.get(
          buildPath("api/admin/email-template", id)
        );
        const { content, subject, email_template_id } = data.data || {};
        methods.reset({
          content,
          subject,
          email_template_id: email_template_id ? email_template_id : "",
        });
      } catch (err) {
        enqueueSnackbar(err.message, { variant: "error" });
        console.log(err);
      }
    };

    if (id) fetchData(id);
  }, [id]);

  return { methods };
};

export default useGetTemplate;
