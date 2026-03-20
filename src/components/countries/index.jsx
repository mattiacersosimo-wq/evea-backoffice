import { RHFSelect } from "src/components/hook-form";
import Map from "src/components/map";

import { useTranslation } from "react-i18next";
import { countries } from "./countries";

const Countries = ({ type = "alpha_3", name, label, ...rest }) => {
  const { t } = useTranslation();
  const renderer =
    type === "alpha_3"
      ? ({ name, alpha_3 }) => <option value={alpha_3}>{name}</option>
      : ({ name, alpha_2 }) => <option value={alpha_2}>{name}</option>;

  return (
    <RHFSelect
      {...rest}
      name={name ? name : "country"}
      label={label ? label : t("profile.choose_country")}
    >
      <option value="" />
      <Map list={countries} render={renderer} />
    </RHFSelect>
  );
};

export default Countries;
