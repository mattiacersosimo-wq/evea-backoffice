import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useDialogContext } from "src/components/customDialog";
import { object, string } from "yup";

const schema = object().shape({
  document: string().required("Document is required"),
});

const defaultValues = {
  document: "",
};

const useDocumentForm = () => {
  const methods = useForm({ defaultValues, resolver: yupResolver(schema) });
  const { open } = useDialogContext();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = methods.handleSubmit(async (inputData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    methods.reset(defaultValues);
    open("");
    enqueueSnackbar("Added the document");
  });

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useDocumentForm;
