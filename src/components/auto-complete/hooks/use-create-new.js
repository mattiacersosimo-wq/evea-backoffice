import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";

const useCreateNew = (textFieldProps = {}, getOptions) => {
  const { enqueueSnackbar } = useSnackbar();

  const { defaultValues, createFunction } = textFieldProps || {};
  const methods = useForm({
    defaultValues,
  });

  const createNewEntry = methods.handleSubmit(async (inputData) => {
    const { status, message } = await createFunction(inputData);
    if (status) {
      enqueueSnackbar(message);
      getOptions();
      return;
    }

    enqueueSnackbar(message, { variant: "error" });
  });

  return { methods, createNewEntry };
};

export default useCreateNew;
