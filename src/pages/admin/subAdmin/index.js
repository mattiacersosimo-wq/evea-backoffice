import { Box, Button, useMediaQuery } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import SubAdmin from "./subAdmin";
import Translate from "src/components/translate";

const Index = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const buttonProps = {
    size: isSmallScreen ? "small" : "medium",
  };
  return (
    <div>
      <Page title={"sub_admin.sub_admins"}>
        <Box>
          <HeaderBreadcrumbs
            heading={"sub_admin.sub_admins"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              { name: "sub_admin.sub_admins" },
            ]}
            action={
              <>
                <Box
                  sx={{
                    display: "grid",
                    columnGap: 1,
                    rowGap: 3,
                    gridTemplateColumns: {
                      xs: "repeat(1, 1fr)",
                      sm: "repeat(2, 1fr)",
                    },
                  }}
                >
                  <Button
                    {...buttonProps}
                    component={RouterLink}
                    to={PATH_DASHBOARD.subAdmin.add_user_group}
                    variant="contained"
                    startIcon={<Iconify icon={"eva:plus-fill"} />}
                  >
                    <Translate> {"sub_admin.user_group"}</Translate>
                  </Button>

                  <Button
                    {...buttonProps}
                    component={RouterLink}
                    to={PATH_DASHBOARD.subAdmin.add_sub_admin}
                    variant="contained"
                    startIcon={<Iconify icon={"eva:plus-fill"} />}
                  >
                    <Translate>{"sub_admin.sub_admin"}</Translate>
                  </Button>
                </Box>
              </>
            }
          />
          <SubAdmin />
        </Box>
      </Page>
    </div>
  );
};

export default Index;
