import React from "react";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import { Currency } from "src/components/with-prefix";
import useGetTeamPerformance from "../../hooks/use-get-team-performance";
import PerformersCard from "../performers-card";
import PerformersCardItem from "../performers-card-item";
import { useTranslation } from "react-i18next";

const TopEarners = () => {
  const state = useGetTeamPerformance("api/admin/dashboard/top-earners");
  const { t } = useTranslation();
  const { data, ...dataProps } = state;

  return (
    <PerformersCard title="global.top_earners" subTitle={t("global.earning")}>
      <DataHandlerList dataProps={dataProps}>
        <Scrollbar sx={{ height: "300px" }}>
          <Map
            list={data}
            render={({ user, total_amount_sum, user_profile }) => {
              return (
                <PerformersCardItem
                  email={user?.email}
                  uname={user?.username}
                  img={user_profile?.profile_image}
                >
                  <Currency>{total_amount_sum}</Currency>
                </PerformersCardItem>
              );
            }}
          />
        </Scrollbar>
      </DataHandlerList>
    </PerformersCard>
  );
};

export default TopEarners;
