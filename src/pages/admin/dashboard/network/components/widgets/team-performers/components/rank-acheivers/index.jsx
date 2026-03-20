import Scrollbar from "src/components/Scrollbar";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import useGetTeamPerformance from "../../hooks/use-get-team-performance";
import PerformersCard from "../performers-card";
import PerformersCardItem from "../performers-card-item";
import { useTranslation } from "react-i18next";

const RankAchievers = () => {
  const state = useGetTeamPerformance("api/admin/dashboard/top-rank-achievers");
  const { t } = useTranslation();
  const { data, ...dataProps } = state;

  return (
    <PerformersCard
      title="global.rank_achievers"
      subTitle={t("global.current_rank")}
    >
      <DataHandlerList dataProps={dataProps}>
        <Scrollbar
          sx={{
            height: "300px",
          }}
        >
          <Map
            list={data}
            render={({ email, username, rank, user_profile }) => {
              return (
                <PerformersCardItem
                  email={email}
                  uname={username}
                  img={user_profile?.profile_image}
                >
                  {rank?.rank_name}
                </PerformersCardItem>
              );
            }}
          />
        </Scrollbar>
      </DataHandlerList>
    </PerformersCard>
  );
};

export default RankAchievers;
