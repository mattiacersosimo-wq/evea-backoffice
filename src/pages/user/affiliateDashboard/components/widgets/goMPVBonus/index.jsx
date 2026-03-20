import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";
import { useTranslation } from "react-i18next";
import BonusWidget from "../../BonusWidget";
import Progress from "./progress";

const useHigherRank = () => {
  const [higherRank, setHigherRank] = useState(null);
  const handleErrors = useErrors();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await fetchUser("affiliate-dashboard/gomvp-Progressbar");
        if (status === 200) {
          setHigherRank(data?.data[0]);
        }
      } catch (err) {
        handleErrors(err);
      }
    };
    fetchData();
  }, []);
  return { higherRank };
};

const GoMVPBonus = () => {
  const { higherRank } = useHigherRank();
  const { t } = useTranslation();

  return (
    <BonusWidget
      icon="mdi:rocket-launch-outline"
      color="#4CAF50"
      title={t("user_dashboard.go_MVP_bonus")} expired={higherRank?.is_expired === 1}
    >
      <Progress higherRank={higherRank} />
    </BonusWidget>
  );
};

export default GoMVPBonus;
