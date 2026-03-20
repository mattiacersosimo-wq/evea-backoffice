import { Box, Button, Divider, Grid, List, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";

import Translate from "src/components/translate";
import { PATH_DASHBOARD } from "src/routes/paths";
import { isMenuActive } from "src/utils/actionProtector";
import MenuLinks from "./MenuLink";
import { default as bottomLink } from "./data/bottomLinks";
import topLink from "./data/topLinks";

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("create-ticket"),
  };
};

const SideBar = () => {
  const status = genStatus(
    "nav.communication.title",
    "nav.communication.help_center"
  );

  return (
    <Grid item xs={12} sm={3} md={3}>
      <Paper elevation={2}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
          }}
        >
          <Ternary
            when={status.add}
            then={
              <>
                <nav>
                  <List className="liStyle">
                    <Box sx={{ padding: "10px" }}>
                      <Button
                        LinkComponent={Link}
                        to={PATH_DASHBOARD.communication.addTicket}
                        startIcon={<Iconify icon="mingcute:add-fill" />}
                        fullWidth
                        variant="contained"
                        name="create-ticket"
                      >
                        <Translate>help_center.create</Translate>
                      </Button>
                    </Box>
                  </List>
                </nav>
                <Divider />
              </>
            }
          />
          <nav aria-label="main mailbox folders">
            <List className="liStyle">
              <MenuLinks linkList={topLink} />
              <Divider />
              <MenuLinks linkList={bottomLink} />
            </List>
          </nav>
        </Box>
      </Paper>
    </Grid>
  );
};

export default SideBar;
