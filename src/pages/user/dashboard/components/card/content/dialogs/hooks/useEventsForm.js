import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useDialogContext } from "src/components/customDialog";
import { object, string } from "yup";

const schema = object().shape({
  name: string().required("Name is required"),
  host: string().required("Host name is required"),
  date: string().required("Date is required"),
  time: string().required("Time is required is required"),
  duration: string().required("Duration is required"),
});

const defaultValues = { name: "", host: "", date: "", time: "", duration: "" };

const useEventsForm = () => {
  const methods = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });
  const { open } = useDialogContext();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    open("");
    enqueueSnackbar("Added Event");
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useEventsForm;
