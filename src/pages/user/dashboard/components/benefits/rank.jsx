import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import Iconify from "src/components/Iconify";

const Rank = ({ setSelected }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose =
    (item = null) =>
    () => {
      if (item) setSelected(item);

      setAnchorEl(null);
    };

  const options = [
    "Business Builder",
    "Bronze Executive",
    "Silver Executive",
    "Gold Executive",
    "Emerald Executive",
  ];

  const menuItems = options.map((item) => (
    <MenuItem onClick={handleClose(item)}>{item}</MenuItem>
  ));

  return (
    <>
      <Button
        sx={{ width: "fit-content" }}
        onClick={handleClick}
        endIcon={<Iconify icon="bx:chevron-down" />}
      >
        Select Rank
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose()}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {menuItems}
      </Menu>
    </>
  );
};

export default Rank;
