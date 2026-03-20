import { useForm } from "react-hook-form";

const defaultValues = {
  start_date: "",
  end_date: "",
  username: "",
  email: "",
};

const useFilter = (fetchData) => {
  const methods = useForm({ defaultValues });
  const { handleSubmit } = methods;
  const onSubmit = async (inputData) => {
    const query = Object.entries(inputData)
      .map(([key, value]) => {
        if (value) return `${key}=${value}`;
      })
      .filter((v) => v !== null)
      .join("&")
      .trim();

    fetchData(query);
  };

  return { methods, onSubmit: handleSubmit(onSubmit) };
};

export default useFilter;
