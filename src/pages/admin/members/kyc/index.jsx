import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { PATH_DASHBOARD } from "src/routes/paths";
import KycUsers from "./components/KycUsers";

const Payout = () => {
  return (
    <Page title="global.kyc_details">
      <Box>
        <HeaderBreadcrumbs
          heading="global.kyc_details"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "global.kyc_details" },
          ]}
        />
        <KycUsers />
      </Box>
    </Page>
  );
};

export default Payout;
