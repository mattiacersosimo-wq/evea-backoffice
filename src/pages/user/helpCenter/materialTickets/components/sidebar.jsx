import { Box, Button, Divider, Drawer, List } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import { SkeletonMailSidebarItem } from "src/components/skeleton";
import Translate from "src/components/translate";
import { NAVBAR } from "src/config";
import useResponsive from "src/hooks/useResponsive";
import { PATH_USER } from "src/routes/paths";
import SidebarItem from "./sidebarItem";

const _data = [
  {
    id: "all",
    type: "system",
    name: "support_tickets.side_bar.all",
    slug: "all",
  },
  {
    id: "open",
    type: "system",
    name: "support_tickets.side_bar.open",
    slug: "open",
  },
  {
    id: "resolved",
    type: "system",
    name: "support_tickets.side_bar.resolved",
    slug: "resolved",
  },
  {
    id: "closed",
    type: "system",
    name: "support_tickets.side_bar.closed",
    slug: "closed",
  },
  {
    id: "inprogress",
    type: "system",
    name: "support_tickets.side_bar.in_progress",
    slug: "in_progress",
  },
  {
    id: "responded",
    type: "system",
    name: "support_tickets.side_bar.responded",
    slug: "responded",
  },
];

const Sidebar = ({ isOpenSidebar, onCloseSidebar }) => {
  const { pathname } = useLocation();

  const isDesktop = useResponsive("up", "md");

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar>
      <Box sx={{ p: 3 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Iconify icon={"eva:plus-fill"} />}
          component={RouterLink}
          to={PATH_USER.helpCenter.createTicket.contactSupport}
          name="create-ticket"
        >
          <Translate>support_tickets.create</Translate>
        </Button>
      </Box>

      <Divider />

      <List disablePadding>
        {_data.map((label, index) =>
          label ? (
            <SidebarItem key={label.id} label={label} />
          ) : (
            <SkeletonMailSidebarItem key={index} />
          )
        )}
      </List>
    </Scrollbar>
  );

  return (
    <>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          PaperProps={{
            sx: { width: NAVBAR.BASE_WIDTH, position: "relative" },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: NAVBAR.BASE_WIDTH } }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
};

Sidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onOpenCompose: PropTypes.func,
  onCloseSidebar: PropTypes.func,
};

export default Sidebar;
