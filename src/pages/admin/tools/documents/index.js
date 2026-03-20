import { Box } from "@mui/material";

import { PATH_DASHBOARD } from "src/routes/paths";

import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import "../style.css";
import MainSection from "./components/MainSection";

const Documents = () => {
  return (
    <Page title={"tools.documents.documents"}>
      <Box>
        <HeaderBreadcrumbs
          heading={"tools.documents.documents"}
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "tools.documents.documents" },
          ]}
        />

        <MainSection />
      </Box>
    </Page>
  );
};

export default Documents;
