import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import useSettings from "src/hooks/useSettings";
import { PATH_DASHBOARD } from "src/routes/paths";

const PageWrapper = ({ children }) => {
  const { themeStretch } = useSettings();

  return (
    <Page
      sx={{ p: { md: 0, lg: 0, md: "10px", xs: "10px" } }}
      title={"adminCommunication.mail.mail"}
    >
      <Container maxWidth={themeStretch ? false : "xl"}>
        <HeaderBreadcrumbs
          heading={"adminCommunication.mail.mail"}
          links={[
            {
              name: "dashboard",
              href: PATH_DASHBOARD.root,
            },
            { name: "adminCommunication.mail.mail" },
          ]}
        />
        {children}
      </Container>
    </Page>
  );
};

export default PageWrapper;
