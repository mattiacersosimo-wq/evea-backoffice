import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";

import axiosInstance from "src/utils/axios";
import URI from "src/utils/urlConfig";
import RankItem from "../list/rankItem";
import { useTranslation } from "react-i18next";

const useRank = () => {
  const handleErrors = useErrors();
  const [data, setData] = useState({
    left_team: [],
    right_team: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          URI.admin.network.rankCount
        );
        if (status === 200) {
          setData(data.data);
        }
      } catch (err) {
        handleErrors(err);
      }
    };
    fetchData();
  }, []);

  return data;
};

const RightLeftTeamWidget = () => {
  const data = useRank();
  const { left_team, right_team } = data;
  const { t } = useTranslation();
  return (
    <div>
      <Card sx={{ p: 2 }}>
        <RankItem members={left_team} label={t("network.right_team")} />
        <RankItem members={right_team} label={t("network.left_team")} />
      </Card>
    </div>
  );
};

export default RightLeftTeamWidget;
