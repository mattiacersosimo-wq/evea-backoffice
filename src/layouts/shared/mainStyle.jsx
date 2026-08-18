import { styled } from "@mui/material/styles";
import { HEADER, NAVBAR } from "src/config";

export default styled("main", {
  shouldForwardProp: (prop) => prop !== "collapseClick",
})(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: `calc(${HEADER.MOBILE_HEIGHT + 24}px + env(safe-area-inset-top))`,
  paddingBottom: `calc(16px + env(safe-area-inset-bottom))`,
  paddingLeft: 16,
  paddingRight: 16,
  // Impedisce a card/grid con margin negativi (MUI Grid spacing) di uscire
  // dal viewport a destra su mobile — fix "card tagliata al bordo"
  overflowX: "hidden",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create("margin-left", {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}));
