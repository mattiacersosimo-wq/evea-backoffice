import useFilterForm from "./useFilterForm";

const useFilter = (onFilter) => {
  const methods = useFilterForm();

  const onSubmit = async (data) => {
    await onFilter(data);
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useFilter;
