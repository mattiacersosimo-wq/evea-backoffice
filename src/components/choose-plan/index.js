import { capitalCase } from "change-case";
import { useTranslation } from "react-i18next";

import { PLANS } from "src/CONSTANTS";
import { RHFSelect } from "src/components/hook-form";
import Map from "src/components/map";
import Ternary from "src/components/ternary";
import { usePlan } from "src/store/plan";

const ChoosePlan = () => {
  const plan = usePlan();
  const { t } = useTranslation();
  return (
    <Ternary
      when={!plan}
      then={
        <RHFSelect name="plan" label={t("register.choose_plan")}>
          <Map
            list={Object.entries(PLANS)}
            render={([k, v]) => (
              <option value={v} key={v}>
                {capitalCase(k)}
              </option>
            )}
          />
        </RHFSelect>
      }
    />
  );
};

export default ChoosePlan;
