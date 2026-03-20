import { useEffect } from "react";
import CreateItem from "./components/create-item";
import InputField from "./components/input-field";
import useCreateNew from "./hooks/use-create-new";
import useMultiSelect from "./hooks/use-multi-select";
import useOptions from "./hooks/use-options";

import { Autocomplete as MuiAutoComplete } from "@mui/material";
import Ternary from "../ternary";

const AutoComplete = ({
  isPackage,
  fetchData,
  textFieldProps = {},
  ...props
}) => {
  const [options, getOptions] = useOptions(fetchData);
  const { methods, createNewEntry } = useCreateNew(textFieldProps, getOptions);
  const { addKey, label } = textFieldProps || {};
  const {
    watch,
    setValue,

    formState: { isSubmitting },
  } = methods;

  const text = watch(addKey);
  const updateText = (v) => setValue(addKey, v);

  const { multiple, name, optionLabel, createMode } = props;

  const { getItems, update } = useMultiSelect(options, name, multiple);

  const handleChange = (_, v) => {
    update(v);

    if (!multiple) {
      updateText(v?.name || "");
    } else {
      updateText("");
    }
  };
  const selected = getItems();

  useEffect(() => {
    if (!text && Boolean(selected?.name)) {
      updateText(selected.name);
    }
  }, [selected, text]);

  return (
    <>
      <MuiAutoComplete
        id={name}
        multiple={multiple}
        value={selected}
        options={options}
        inputValue={text}
        onChange={handleChange}
        getOptionLabel={optionLabel}
        noOptionsText={
          <Ternary
            when={text}
            then={
              <CreateItem
                loading={isSubmitting}
                createNewEntry={createNewEntry}
                text={text}
                createMode={createMode}
              />
            }
            otherwise="No Options"
          />
        }
        renderInput={(params) => (
          <InputField
            isPackage={isPackage}
            params={params}
            methods={methods}
            name={addKey}
            label={label}
            parent={name}
          />
        )}
      />
    </>
  );
};

export default AutoComplete;
