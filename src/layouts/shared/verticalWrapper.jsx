import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import ImpersonationBanner from "src/components/impersonationBanner";
import { HEADER } from "src/config";

export default () => (
  <Box
    component="main"
    sx={{
      px: { lg: 2 },
      pt: {
        xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
        lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
      },
      pb: {
        xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
        lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
      },
    }}
  >
    <ImpersonationBanner />
    <Outlet />
  </Box>
);
