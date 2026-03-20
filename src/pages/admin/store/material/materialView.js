import { capitalCase } from "change-case";

import { Box, Button, Card, Tab, Tabs } from "@mui/material";

import { PATH_DASHBOARD } from "src/routes/paths";

import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { Link, useParams } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import useCustomTabs from "src/hooks/useCustomTabs";

import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import { isMenuActive } from "src/utils/actionProtector";
import objectToQueryString from "src/utils/object-to-query-string";
import squashPathAndQueryString from "src/utils/squash-path-and-query-string";
import MaterialsProvider from "./store";
import useTab from "./tabs";

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    addMaterial: test("add-material"),
  };
};

const MaterialView = () => {
  const MATERIAL_TABS = useTab();

  const { currentTab, onChangeTab } = useCustomTabs("document", "document");

  const { id } = useParams();

  const { addMaterial } = genStatus("nav.store.title", "nav.store.materials");
  const { t } = useTranslation();
  return (
    <div>
      <Page title={"material.materials"}>
        <HeaderBreadcrumbs
          heading={"material.material"}
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            {
              name: "material.material",
              href: PATH_DASHBOARD.store.material,
            },
            { name: "material.view" },
          ]}
          action={
            <>
              <Ternary
                when={addMaterial}
                then={
                  <Button
                    LinkComponent={Link}
                    to={squashPathAndQueryString(
                      PATH_DASHBOARD.store.material_add,
                      objectToQueryString({
                        id,
                      })
                    )}
                    variant="contained"
                    startIcon={<Iconify icon="akar-icons:plus" />}
                  >
                    <Translate>{"material.add"}</Translate>
                  </Button>
                }
              />
            </>
          }
        />
        <Card sx={{ p: 3 }}>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={currentTab}
            onChange={onChangeTab}
          >
            {MATERIAL_TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                label={capitalCase(t(tab.label))}
                icon={tab.icon}
                value={tab.value}
              />
            ))}
          </Tabs>

          <Box sx={{ mb: 5 }} />
          {MATERIAL_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Card>
      </Page>
    </div>
  );
};

export default () => (
  <MaterialsProvider>
    <MaterialView />
  </MaterialsProvider>
);
