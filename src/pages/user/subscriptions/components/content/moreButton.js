import { useState } from "react";
// form
// @mui
import { Divider, IconButton, MenuItem } from "@mui/material";
// components
import Iconify from "src/components/Iconify";
import MenuPopover from "src/components/MenuPopover";

const MoreButton = () => {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };
  return (
    <>
      <IconButton onClick={handleOpen} name="more-button">
        <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
      </IconButton>
      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: "auto",
          "& .MuiMenuItem-root": {
            px: 1,
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <MenuItem name="add-review">
          <Iconify icon={"bi:check-lg"} sx={{ color: "#00c853", ...ICON }} />
          {"userMySubscriptions.addReview "}
        </MenuItem>

        <MenuItem name="blog">
          <Iconify
            icon={"akar-icons:link-chain"}
            sx={{ color: "#0091ea", ...ICON }}
          />
          {"userMySubscriptions.blog"}
        </MenuItem>

        <MenuItem name="events">
          <Iconify icon={"uil:calender"} sx={{ color: "#25223e", ...ICON }} />
          {"userMySubscriptions.events"}
        </MenuItem>
        <MenuItem name="documents">
          <Iconify
            icon={"healthicons:i-documents-accepted-outline"}
            sx={{ color: "#d50000", ...ICON }}
          />
          {"userMySubscriptions.documents"}
        </MenuItem>
        <MenuItem name="videos">
          <Iconify
            icon={"akar-icons:play"}
            sx={{ color: "#ff6d00", ...ICON }}
          />
          {"userMySubscriptions.videos"}
        </MenuItem>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem sx={{ color: "#155900" }} name="view">
          <Iconify icon={"carbon:view"} sx={{ ...ICON }} />
          {"userMySubscriptions.view"}
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MoreButton;
