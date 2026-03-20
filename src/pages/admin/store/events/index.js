import { Box, Button, useMediaQuery } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Ternary from "src/components/ternary";

import Translate from "src/components/translate";
import { PATH_DASHBOARD } from "src/routes/paths";
import { isMenuActive } from "src/utils/actionProtector";
import EventsList from "./eventsList";

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add"),
    edit: test("edit"),
    delete: test("delete"),
  };
};

const Index = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const buttonProps = {
    size: isSmallScreen ? "small" : "medium",
  };

  const status = genStatus("nav.store.title", "nav.store.events");
  return (
    <div>
      <Page title={"events.events_title"}>
        <Box sx={{ p: 2 }}>
          <HeaderBreadcrumbs
            heading={"events.events"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              { name: "events.events" },
            ]}
            action={
              <>
                <Ternary
                  when={status.add}
                  then={
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
                        {...buttonProps}
                        component={RouterLink}
                        to={PATH_DASHBOARD.store.events_add}
                        variant="contained"
                        size="small"
                        startIcon={<Iconify icon={"eva:plus-fill"} />}
                        name="add"
                      >
                        <Translate>events.events</Translate>
                      </Button>
                    </Box>
                  }
                />
              </>
            }
          />

          <Box>
            <EventsList status={status} />
          </Box>
        </Box>
      </Page>
    </div>
  );
};

export default Index;
