import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";
import { useTranslation } from "react-i18next";
import BonusWidget from "../../BonusWidget";
import NewRankCard from "./rank";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";

const useHigherRank = () => {
  const [state, actions] = useDataHandler();
  const [higherRank, setHigherRank] = useState([]);
  const handleErrors = useErrors();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await fetchUser("affiliate-dashboard/rank-progressbar");
        if (status === 200) {
          setHigherRank(data?.data);
          if (data?.data?.length) { actions.success(data); } else { actions.success(); }
        }
      } catch (err) {
        actions.error();
        handleErrors(err);
      }
    };
    fetchData();
  }, []);
  return { higherRank, state };
};

const RankProgressBar = () => {
  const { higherRank, state } = useHigherRank();
  const { t } = useTranslation();

  return (
    <BonusWidget
      icon="mdi:podium-gold"
      color="#B8963B"
      title={t("user_dashboard.rank_progress_bar")}
    >
      <NewRankCard state={state} higherRank={higherRank} />
    </BonusWidget>
  );
};

export default RankProgressBar;
