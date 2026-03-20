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
        const { status, data } = await fetchUser("affiliate-dashboard/pmb-Progressbar");
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

const MPVMentorBonus = () => {
  const { higherRank } = useHigherRank();
  const { t } = useTranslation();

  return (
    <BonusWidget
      icon="mdi:account-group-outline"
      color="#9C27B0"
      title={t("user_dashboard.mvp_mentor_bonus")}
    >
      <Progress higherRank={higherRank} />
    </BonusWidget>
  );
};

export default MPVMentorBonus;
