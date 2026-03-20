import { Box, Button } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Translate from "src/components/translate";

import { PATH_DASHBOARD } from "src/routes/paths";

const Wrapper = ({ children, openAdd }) => {
  return (
    <div>
      <Page title={"products.video.title"}>
        <Box sx={{ p: 2 }}>
          <HeaderBreadcrumbs
            heading={"products.video.title"}
            links={[
              { name: "dashboard", href: PATH_DASHBOARD.root },
              {
                name: "products.video.product",
                href: PATH_DASHBOARD.store.products,
              },
              { name: "products.video.title" },
            ]}
            action={
              <Button
                onClick={openAdd}
                variant="contained"
                startIcon={<Iconify icon="carbon:add" />}
              >
                <Translate>{"products.video.add"}</Translate>
              </Button>
            }
          />
          {children}
        </Box>
      </Page>
    </div>
  );
};

export default Wrapper;
