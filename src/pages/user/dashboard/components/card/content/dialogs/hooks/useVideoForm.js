import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useDialogContext } from "src/components/customDialog";
import { object, string } from "yup";

const schema = object().shape({
  video: string().url().required("Video url is required"),
});

const defaultValues = {
  video: "",
};

const useVideoForm = () => {
  const methods = useForm({ defaultValues, resolver: yupResolver(schema) });
  const { open } = useDialogContext();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = methods.handleSubmit(async (inputData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log(inputData);
    open("");
    enqueueSnackbar("Added the Video");
  });

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useVideoForm;
