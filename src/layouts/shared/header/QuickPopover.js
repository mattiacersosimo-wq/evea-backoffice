import { Box, Tooltip } from "@mui/material";
import { useState } from "react";
import { IconButtonAnimate } from "src/components/animate";
import Iconify from "src/components/Iconify";
import MenuPopover from "src/components/MenuPopover";
import QuickMenus from "./quickMenus";

const QuickPopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = anchorEl;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButtonAnimate
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Iconify sx={{ width: 30, height: 30 }} icon="gg:options" />
          </IconButtonAnimate>
        </Tooltip>
      </Box>

      <MenuPopover
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        sx={{
          mt: 0.5,
          ml: 0.75,
          width: "auto",
          "& .MuiMenuItem-root": {
            px: 1,
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <QuickMenus />
      </MenuPopover>
    </div>
  );
};

export default QuickPopover;
