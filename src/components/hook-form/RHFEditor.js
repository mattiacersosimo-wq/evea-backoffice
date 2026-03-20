import PropTypes from "prop-types";
// form
import { Controller, useFormContext } from "react-hook-form";
// @mui
import { FormHelperText } from "@mui/material";
//
import Editor from "../editor";
import Translate from "../translate";

// ----------------------------------------------------------------------

RHFEditor.propTypes = {
  name: PropTypes.string,
};

export default function RHFEditor({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Editor
          id={name}
          name={name}
          value={field.value}
          onChange={field.onChange}
          error={!!error}
          helperText={
            <FormHelperText error sx={{ px: 2, textTransform: "capitalize" }}>
              <Translate>{error?.message}</Translate>
            </FormHelperText>
          }
          {...other}
        />
      )}
    />
  );
}
