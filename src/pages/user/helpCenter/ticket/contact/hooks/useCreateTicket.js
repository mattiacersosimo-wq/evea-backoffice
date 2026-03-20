import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { PATH_USER } from "src/routes/paths";
import fetchUser from "src/utils/fetchUser";
import { object, string } from "yup";

const schema = object().shape({
  department_id: string()
    .typeError("errors.tickets.create_form.department_id.type")
    .required("errors.tickets.create_form.department_id.required"),

  priority_id: string()
    .typeError("errors.tickets.create_form.priority_id.type")
    .required("errors.tickets.create_form.priority_id.required"),

  category_id: string()
    .typeError("errors.tickets.create_form.category_id.type")
    .required("errors.tickets.create_form.category_id.required"),
  subject: string().required("errors.tickets.create_form.subject.required"),
  description: string().required(
    "errors.tickets.create_form.description.required"
  ),
});

const defaultValues = {
  subject: "",
  priority_id: null,
  department_id: null,
  category_id: null,
  description: "",
  active: 1,
  attachments_url: "",
};

const useCreateTicket = () => {
  const methods = useForm({ defaultValues, resolver: yupResolver(schema) });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = methods.handleSubmit(async (inputData) => {
    const { attachments_url, ...rest } = inputData;
    const reqData = new FormData();
    Object.entries(rest).forEach(([k, v]) => reqData.append(k, v));
    if (attachments_url) {
      const [file] = attachments_url;
      const FILE_SIZE = 2048000;
      if (file) {
        if (file?.size < FILE_SIZE) {
          reqData.append("attachments_url", file);
        } else {
          methods.setError("attachments_url", {
            message: `The file size should be less than ${FILE_SIZE}KB`,
          });
          return;
        }
      }
    }

    try {
      const { status, message } = await (
        await fetchUser.post("support-tickets", reqData)
      ).data;
      if (status) {
        enqueueSnackbar(message);
        navigate(PATH_USER.helpCenter.createTicket.subCategory());
      }
    } catch (err) {
      console.error(err);
    }
  });

  return { methods, onSubmit };
};

export default useCreateTicket;
