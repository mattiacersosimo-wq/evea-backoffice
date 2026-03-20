import PropTypes from "prop-types";
// form
import { Controller, useFormContext } from "react-hook-form";
// @mui
import { FormHelperText } from "@mui/material";
// type
import { useTranslation } from "react-i18next";
import { UploadAvatar, UploadMultiFile, UploadSingleFile } from "../upload";

// ----------------------------------------------------------------------

RHFUploadAvatar.propTypes = {
  name: PropTypes.string,
  fileUrl: PropTypes.string,
};

export function RHFUploadAvatar({ name, fileUrl, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;

        return (
          <div>
            <UploadAvatar
              error={checkError}
              {...other}
              file={field.value ? field.value : fileUrl}
            />
            {checkError && (
              <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

RHFUploadSingleFile.propTypes = {
  name: PropTypes.string,
};

export function RHFUploadSingleFile({ name, maxSize, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;

        return (
          <UploadSingleFile
            accept="image/*"
            name={name}
            maxSize={maxSize}
            file={field.value?.find(Boolean) || ""}
            error={checkError}
            helperText={
              checkError && (
                <FormHelperText error sx={{ px: 2 }}>
                  {error.message}
                </FormHelperText>
              )
            }
            {...other}
          />
        );
      }}
    />
  );
}

RHFUploadMultiFile.propTypes = {
  name: PropTypes.string,
};

export function RHFUploadMultiFile({ name, ...other }) {
  const { control } = useFormContext();
  const { t } = useTranslation();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && field.value?.length === 0;
        return (
          <UploadMultiFile
            name={name}
            accept="image/*"
            files={field.value}
            error={checkError}
            helperText={
              checkError && (
                <FormHelperText error sx={{ px: 2 }}>
                  {t(error?.message)}
                </FormHelperText>
              )
            }
            {...other}
          />
        );
      }}
    />
  );
}
