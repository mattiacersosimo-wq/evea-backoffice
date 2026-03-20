import { Box, Card, Tab, Tabs } from "@mui/material";
import { Page } from "@react-pdf/renderer";
import { capitalCase } from "change-case";
import { useTranslation } from "react-i18next";
import { Outlet, useMatch, useNavigate, useParams } from "react-router";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";

import useQueryParams from "src/hooks/useQueryParams";
import { PATH_USER } from "src/routes/paths";
import objectToQueryString from "src/utils/object-to-query-string";
import squashPathAndQueryString from "src/utils/squash-path-and-query-string";

const SUB_TABS = [
  {
    value: "home",
    text: "user.subscriptions.labels.view",
    name: "home",
  },
  {
    value: "documents",
    text: "user.subscriptions.labels.documents",
    name: "documents",
  },
  {
    value: "events",
    text: "user.subscriptions.labels.events",
    name: "events",
  },
  {
    value: "videos",
    text: "user.subscriptions.labels.videos",
    name: "videos",
  },
  {
    value: "comment",
    text: "user.subscriptions.labels.review",
    name: "comment",
  },
];

const SubscriptionTab = () => {
  const match = useMatch("/user/subscriptions/view/1/:slug");
  const currentTab = match.params.slug;
  const navigate = useNavigate();
  const { id } = useParams();

  const { queryObject } = useQueryParams();
  const { name } = queryObject;
  const { t } = useTranslation();
  return (
    <div>
      <Page title="user.subscriptions.title">
        <Box sx={{ p: 2 }}>
          <HeaderBreadcrumbs
            heading="user.subscriptions.title"
            links={[
              { name: "global.dashboard", href: PATH_USER.root },
              {
                name: "user.subscriptions.title",
                href: PATH_USER.subscriptions.root,
              },
              { name: capitalCase(name || "view") },
            ]}
          />
          <Card sx={{ p: 2 }}>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={currentTab}
              onChange={(_, v) =>
                navigate(
                  squashPathAndQueryString(
                    PATH_USER.subscriptions.view(id)(v),
                    objectToQueryString({ name })
                  )
                )
              }
            >
              {SUB_TABS.map((tab) => (
                <Tab
                  disableRipple
                  key={tab.value}
                  value={tab.value}
                  label={t(tab.text)}
                  icon={tab.icon}
                  name={tab.name}
                />
              ))}
            </Tabs>
            <Box sx={{ mb: 2 }} />
            <Outlet />
          </Card>
        </Box>
      </Page>
    </div>
  );
};

export default SubscriptionTab;
