import { useMemo } from "react";
import { useOutletContext } from "react-router";
import Leaderboard from "src/pages/user/reports/leaderboard";

const LeaderboardWrapper = ({ title, heading }) => {
  const { setData } = useOutletContext();
  useMemo(() => setData({ title, heading, type: "leaderboard" }), [title, heading]);
  return <Leaderboard />;
};

export default LeaderboardWrapper;
