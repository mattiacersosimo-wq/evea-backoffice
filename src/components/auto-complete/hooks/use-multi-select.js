import { useFormContext } from "react-hook-form";
import { extractMultiple, extractSingle } from "../utils/extract";
import { getMultiple, getSingle } from "../utils/get";

const useMultiSelect = (options, name = "", multiple = false) => {
  const { setValue, watch } = useFormContext();

  const selectedId = watch(name);

  const getItems = () =>
    multiple
      ? getMultiple(options, selectedId)
      : getSingle(options, selectedId);

  const update = (v) => {
    const data = multiple ? extractMultiple(v) : extractSingle(v);

    setValue(name, data);
  };

  return { getItems, update };
};

export default useMultiSelect;
