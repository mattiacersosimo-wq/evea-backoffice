import Scrollbar from "src/components/Scrollbar";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import useGetTeamPerformance from "../../hooks/use-get-team-performance";
import PerformersCard from "../performers-card";
import PerformersCardItem from "../performers-card-item";
import { useTranslation } from "react-i18next";

const TopRecruiters = () => {
  const state = useGetTeamPerformance("api/admin/dashboard/top-recruiters");
  const { t } = useTranslation();
  const { data, ...dataProps } = state;
  return (
    <PerformersCard
      title="global.top_recruiters"
      subTitle={t("global.referrals")}
    >
      <DataHandlerList dataProps={dataProps}>
        <Scrollbar sx={{ height: "300px" }}>
          <Map
            list={data}
            render={({ count, user, user_profile }) => {
              return (
                <PerformersCardItem
                  email={user.email}
                  uname={user.username}
                  img={user_profile?.profile_image}
                >
                  {count}
                </PerformersCardItem>
              );
            }}
          />
        </Scrollbar>
      </DataHandlerList>
    </PerformersCard>
  );
};

export default TopRecruiters;
