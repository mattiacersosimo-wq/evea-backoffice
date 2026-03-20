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
        const { status, data } = await fetchUser("affiliate-dashboard/residual-Progressbar");
        if (status === 200) {
          setHigherRank(data?.data[0]);
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

const ResidualBonus = () => {
  const { higherRank, state } = useHigherRank();
  const { t } = useTranslation();

  return (
    <BonusWidget
      icon="mdi:chart-timeline-variant"
      color="#607D8B"
      title={t("user_dashboard.residual_bonus")}
    >
      <Progress higherRank={higherRank} state={state} />
    </BonusWidget>
  );
};

export default ResidualBonus;
