import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/utils/axios";
import { PATH_DASHBOARD } from "src/routes/paths";

const useCreateTemplate = () => {
  const methods = useForm({
    defaultValues: {
      email: "",
      language: "it",
      subject: "",
      email_template_id: "",
      content: "",
    },
  });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = async (inputData) => {
    try {
      const { data } = await axiosInstance.post("api/admin/email-template", {
        email: inputData.email,
        language: inputData.language,
        subject: inputData.subject,
        content: inputData.content,
      });
      enqueueSnackbar(data.message || "Template creato");
      const newId = data?.data?.id;
      if (newId) {
        navigate(PATH_DASHBOARD.settings.email_settings.view(newId, { name: inputData.email }));
      } else {
        navigate(PATH_DASHBOARD.settings.email_settings.root);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      enqueueSnackbar(msg, { variant: "error" });
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useCreateTemplate;
