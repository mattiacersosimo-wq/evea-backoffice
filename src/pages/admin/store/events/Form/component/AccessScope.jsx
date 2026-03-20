import { FormControlLabel, Radio, RadioGroup, Stack } from "@mui/material";
import React from "react";
import { useController } from "react-hook-form";
import { RHFRadioGroup } from "src/components/hook-form";
import LabelStyle from "src/components/label-style";
import Translate from "src/components/translate";
import { useTranslation } from "react-i18next";

const options = [
  { label: "scope.private", value: 1 },
  { label: "scope.public", value: 0 },
];

const AccessScope = () => {
  const { t } = useTranslation();
  const { field } = useController({
    name: "access_scope",
  });

  return (
    <Stack spacing={0} mb={2}>
      <LabelStyle>
        <Translate>events.add_event.access_scope</Translate>
      </LabelStyle>
      <RadioGroup
        row
        sx={{
          "& .MuiFormControlLabel-root": { mr: 4 },
        }}
      >
        {options.map((option) => {
          return (
            <FormControlLabel
              onChange={(e) => field.onChange(parseInt(e.target.value))}
              value={option.value}
              key={option}
              control={<Radio checked={option.value === field.value} />}
              label={t(option.label)}
            />
          );
        })}
      </RadioGroup>
    </Stack>
  );
};
export default AccessScope;
