import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const defaultValues = {
  sample_doc: "",
};

const schema = Yup.object().shape({
  sample_doc: Yup.mixed().test("isFile", "Select an document", (value) =>
    Boolean(value?.length)
  ),
});

const useEditForm = () => {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  return methods;
};
export default useEditForm;
