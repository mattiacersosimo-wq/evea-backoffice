import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";
import { useTranslation } from "react-i18next";
import BonusWidget from "../../BonusWidget";
import Progress from "./progress";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";

const useHigherRank = () => {
  const [higherRank, setHigherRank] = useState(null);
  const handleErrors = useErrors();
  const [state, actions] = useDataHandler();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await fetchUser("affiliate-dashboard/rgomvp-Progressbar");
        if (status === 200) {
          setHigherRank(data?.data);
          if (data?.data) { actions.success(data); } else { actions.success(); }
        }
      } catch (err) {
        actions.error(); handleErrors(err);
      }
    };
    fetchData();
  }, []);
  return { higherRank, state };
};

const RockSolidBonus = () => {
  const { higherRank, state } = useHigherRank();
  const { t } = useTranslation();

  return (
    <BonusWidget
      icon="mdi:diamond-stone"
      color="#455A64"
      title={t("user_dashboard.rock_solid_bonus")}
    >
      <Progress higherRank={higherRank} state={state} />
    </BonusWidget>
  );
};

export default RockSolidBonus;
