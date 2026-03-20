import { RHFSelect } from "src/components/hook-form";
import Map from "src/components/map";

import { useTranslation } from "react-i18next";
import { countries } from "src/components/countries/countries";
import { useFormContext } from "react-hook-form";

const Countries = ({ type = "alpha_3", name, label, codeField, ...rest }) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const renderer =
    type === "alpha_3"
      ? ({ name, alpha_3 }) => <option value={alpha_3}>{name}</option>
      : ({ name, alpha_2 }) => <option value={alpha_2}>{name}</option>;
  const fieldName = name ? name : "country";

  return (
    <RHFSelect
      {...rest}
      name={fieldName}
      label={label ? label : t("profile.choose_country")}
      onChange={(e) => {
        const value = e.target.value;
        setValue(fieldName, value);
        if (codeField) {
          setValue(codeField, value);
        }
      }}
    >
      <option value="" />
      <Map list={countries} render={renderer} />
    </RHFSelect>
  );
};

export default Countries;
