import { MenuItem } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import MenuPopover from "src/components/MenuPopover";
import Translate from "src/components/translate";

const Actions = ({ forwardRef, onClose, activeId }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = (name) => () => {
    onClose(name);
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  useMemo(() => {
    setAnchorEl(forwardRef);
  }, [forwardRef]);

  return (
    <>
      <TableMenu anchorEl={anchorEl} open={open} onClose={handleClose()}>
        <MenuItem
          component={Link}
          to={`/admin/sub-admin/group/${activeId}`}
          onClick={handleClose()}
        >
          <Iconify icon="akar-icons:edit" />{" "}
          <Translate>{"global.edit"}</Translate>
        </MenuItem>

        <MenuItem sx={{ color: "error.main" }} onClick={handleClose("delete")}>
          <Iconify icon={"eva:trash-2-outline"} />
          <Translate>{"global.delete"}</Translate>
        </MenuItem>
      </TableMenu>
    </>
  );
};

const TableMenu = ({ open, onClose, anchorEl, children }) => (
  <MenuPopover
    open={Boolean(open)}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{ vertical: "top", horizontal: "left" }}
    transformOrigin={{ vertical: "top", horizontal: "right" }}
    arrow="right-top"
    sx={{
      mt: -1,
      width: 160,
      "& .MuiMenuItem-root": {
        px: 1,
        typography: "body2",
        borderRadius: 0.75,
        "& svg": { mr: 2, width: 20, height: 20 },
      },
    }}
  >
    {children}
  </MenuPopover>
);

export default Actions;
