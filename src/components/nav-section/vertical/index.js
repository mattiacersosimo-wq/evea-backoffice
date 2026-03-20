import { Box, List } from "@mui/material";
import PropTypes from "prop-types";
import { NavListRoot } from "./NavList";

NavSectionVertical.propTypes = {
  isCollapse: PropTypes.bool,
  navConfig: PropTypes.array,
};

export default function NavSectionVertical({
  key,
  navConfig,
  isCollapse = false,
  ...other
}) {
  return (
    <Box {...other}>
      {navConfig.map((group, i) => {
        return (
          <List key={i} disablePadding sx={{ px: 2 }}>
            {group.items.map((list) => {
              return (
                <NavListRoot
                  key={list.title}
                  list={list}
                  isCollapse={isCollapse}
                />
              );
            })}
          </List>
        );
      })}
    </Box>
  );
}
