import { Box, Button, Card, Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";
import { Link as RouterLink } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import useTabs from "src/hooks/useTabs";
import { PATH_DASHBOARD } from "src/routes/paths";
import TabsOne from "./tabsOne";
import TabsTwo from "./tabsTwo";

const Index = () => {
  const { currentTab, onChangeTab } = useTabs("how");

  const HELPCENTER_TABS = [
    {
      value: "how",
      text: "How to use  MLM Software ?",
      component: <TabsOne />,
    },
    {
      value: "marketing",
      text: "Marketing Campaigns",
      component: <TabsTwo />,
    },
    {
      value: "your",
      text: "your plan details ?",
      component: <TabsOne />,
    },
  ];
  return (
    <>
      <Page
        sx={{ p: { md: 0, lg: 0, md: "10px", xs: "10px" } }}
        title="Help Center: Communication"
      >
        <Box>
          <HeaderBreadcrumbs
            sx={{ mb: 0, pl: 1 }}
            heading="Help Center"
            links={[
              { name: "Dashboard", href: PATH_DASHBOARD.root },
              { name: "Help Center" },
            ]}
            action={
              <Box
                sx={{
                  display: "grid",
                  columnGap: 1,
                  rowGap: 3,
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(1, 1fr)",
                  },
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<Iconify icon={"bi:ticket-detailed"} />}
                  component={RouterLink}
                  to={PATH_DASHBOARD.communication.help_center_tickets}
                >
                  ticket
                </Button>
              </Box>
            }
          />
          <Card sx={{ p: 4 }}>
            {/* <Box sx={{ mb: 5 }}>
              <Container>
                <TextField
                  fullWidth
                  placeholder="Search user..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify
                          icon={"eva:search-fill"}
                          sx={{ color: "text.disabled", width: 20, height: 20 }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Container>
            </Box> */}
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={currentTab}
              onChange={onChangeTab}
            >
              {HELPCENTER_TABS.map((tab) => (
                <Tab
                  disableRipple
                  key={tab.value}
                  label={capitalCase(tab.text)}
                  icon={tab.icon}
                  value={tab.value}
                />
              ))}
            </Tabs>
            <Box sx={{ mb: 5 }} />
            {HELPCENTER_TABS.map((tab) => {
              const isMatched = tab.value === currentTab;
              return isMatched && <Box key={tab.value}>{tab.component}</Box>;
            })}
          </Card>
        </Box>
      </Page>
    </>
  );
};

export default Index;
