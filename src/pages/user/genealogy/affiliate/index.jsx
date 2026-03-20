import { Box, Divider, Grid } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { Currency } from "src/components/with-prefix";

import ActiveCustomers from "./activeCustomers/index";
import BvHistory from "./bvHistory/index";
import useFetchAffiliateList from "./hooks/useFetchAffiliateList";
import LeftSide from "./leftRight/left";
import RightSide from "./leftRight/right";
import Referrals from "./referrals/index";
import ReportCard from "./reportCards/index";
import BonusWidget from "./widgets/bonusWidget";
import SmallWidgets from "./widgets/smallWidget";
import TeamCard from "./widgets/teamCard";

const Affiliate = () => {
  const {
    current_rank,
    network_bonus,
    referal_bonus,
    referrals_count,
    personal_sales_bv,
    team_sales_bv,
    left_team,
    right_team,
    next_rank,
    highest_rank_acheved,
    last_week_rank,
    weekly_binary_bonus,
  } = useFetchAffiliateList();

  return (
    <Page title={"affiliate_dashboard.affiliate"}>
      <HeaderBreadcrumbs
        heading={"global.dashboard"}
        links={[{ name: "Affiliate" }]}
      />
      <Grid container spacing={2}>
        <Grid item xs={6} md={2}>
          <SmallWidgets
            title={"affiliate_dashboard.personal_sales"}
            total={personal_sales_bv}
            icon={"bxs:user"}
            color="success"
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <SmallWidgets
            title={"affiliate_dashboard.team_sales"}
            total={team_sales_bv}
            icon={"heroicons:users-solid"}
            color="error"
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <SmallWidgets
            title={"affiliate_dashboard.network_bonus"}
            total={network_bonus}
            icon={"akar-icons:network"}
            color="primary"
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <SmallWidgets
            title={"affiliate_dashboard.referral_bonus"}
            total={referal_bonus}
            icon={"fa6-solid:bag-shopping"}
            color="secondary"
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <SmallWidgets
            title={"affiliate_dashboard.referrals"}
            total={referrals_count}
            icon={"fluent:gift-card-20-filled"}
            color="warning"
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <SmallWidgets
            title={"affiliate_dashboard.weekly_payout"}
            total={666}
            icon={"entypo:back-in-time"}
            color="info"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ActiveCustomers
            currentRank={current_rank}
            nextRank={next_rank}
            highestRank={highest_rank_acheved}
            lastWeek={last_week_rank}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <BonusWidget
            title={"affiliate_dashboard.registeredMembers"}
            total={weekly_binary_bonus}
            icon={"eva:person-fill"}
            holdingTank={5}
            networkMembers={3}
            chartData={weekly_binary_bonus}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <BvHistory />
        </Grid>
        <Grid item xs={12} md={6}>
          <Referrals referrals={[]} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              marginTop: "1rem",
              display: "grid",
              columnGap: 1,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
              },
            }}
          >
            <TeamCard
              title={"affiliate_dashboard.left_team"}
              total={left_team}
              icon="bi:arrow-bar-left"
            />
            <TeamCard
              title={"affiliate_dashboard.right_team"}
              total={right_team}
              icon="bi:arrow-bar-right"
            />
            <Box sx={{ marginTop: "1rem" }}>
              <LeftSide title={"affiliate_dashboard.left"} />
            </Box>
            <Box sx={{ marginTop: "1rem" }}>
              <RightSide title={"affiliate_dashboard.right"} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          <Divider />
          <Box
            sx={{
              padding: "1rem",
              display: "grid",
              columnGap: 1,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
                md: "repeat(6, 1fr)",
              },
            }}
          >
            <ReportCard
              title={"affiliate_dashboard.total_numberL"}
              count="250"
            />
            <ReportCard title={"affiliate_dashboard.total_numberR"} count="0" />
            <ReportCard
              title={"affiliate_dashboard.total_teamL"}
              count={<Currency>787</Currency>}
            />
            <ReportCard
              title={"affiliate_dashboard.total_teamR"}
              count={<Currency>98</Currency>}
            />
            <ReportCard title={"affiliate_dashboard.weeklyL"} count="654" />
            <ReportCard title={"affiliate_dashboard.weeklyR"} count="12" />
          </Box>
          <Divider />
        </Grid>
      </Grid>
    </Page>
  );
};

export default Affiliate;
