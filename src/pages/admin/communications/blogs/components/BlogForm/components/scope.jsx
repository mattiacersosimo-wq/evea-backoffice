import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";
import { useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import LabelStyle from "src/components/label-style";
import Translate from "src/components/translate";

const options = [
  { label: "scope.private", value: 1 },
  { label: "scope.public", value: 0 },
];

const Scope = () => {
  const { t } = useTranslation();
  const { field } = useController({
    name: "type",
  });

  return (
    <>
      <LabelStyle>
        <Translate>blogs.create.form.type</Translate>
      </LabelStyle>
      <RadioGroup row>
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
    </>
  );
};

export default Scope;
