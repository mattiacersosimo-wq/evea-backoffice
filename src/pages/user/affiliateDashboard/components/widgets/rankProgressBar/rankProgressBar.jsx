import { useEffect, useState, useCallback } from "react";
import { MenuItem, Stack, TextField } from "@mui/material";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";
import { useTranslation } from "react-i18next";
import BonusWidget from "../../BonusWidget";
import NewRankCard from "./rank";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";

const MONTHS_IT = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const useHigherRank = (month, year) => {
  const [state, actions] = useDataHandler();
  const [higherRank, setHigherRank] = useState([]);
  const handleErrors = useErrors();

  const fetchData = useCallback(async () => {
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;
      const { status, data } = await fetchUser("affiliate-dashboard/rank-progressbar", { params });
      if (status === 200) {
        setHigherRank(data?.data);
        if (data?.data?.length) { actions.success(data); } else { actions.success(); }
      }
    } catch (err) {
      actions.error();
      handleErrors(err);
    }
  }, [month, year]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchData(); }, [fetchData]);

  return { higherRank, state };
};

const RankProgressBar = () => {
  const { t, i18n } = useTranslation();
  const isIt = i18n.language?.startsWith("it");
  const monthNames = isIt ? MONTHS_IT : MONTHS_EN;
  const today = new Date();
  const [monthFilter, setMonthFilter] = useState(today.getMonth() + 1);
  const [yearFilter, setYearFilter] = useState(today.getFullYear());
  const { higherRank, state } = useHigherRank(monthFilter, yearFilter);

  return (
    <BonusWidget
      icon="mdi:podium-gold"
      color="#B8963B"
      title={t("user_dashboard.rank_progress_bar")}
    >
      <Stack direction="row" spacing={1} mb={1.5} onClick={(e) => e.stopPropagation()}>
        <TextField
          select size="small" value={monthFilter}
          onChange={(e) => setMonthFilter(Number(e.target.value))}
          sx={{ width: 110, "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "0.78rem" } }}
        >
          {monthNames.map((m, i) => (
            <MenuItem key={i + 1} value={i + 1} sx={{ fontSize: "0.8rem" }}>{m}</MenuItem>
          ))}
        </TextField>
        <TextField
          select size="small" value={yearFilter}
          onChange={(e) => setYearFilter(Number(e.target.value))}
          sx={{ width: 100, "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "0.78rem" } }}
        >
          {[2024, 2025, 2026, 2027].map((y) => (
            <MenuItem key={y} value={y} sx={{ fontSize: "0.8rem" }}>{y}</MenuItem>
          ))}
        </TextField>
      </Stack>
      <NewRankCard state={state} higherRank={higherRank} />
    </BonusWidget>
  );
};

export default RankProgressBar;
