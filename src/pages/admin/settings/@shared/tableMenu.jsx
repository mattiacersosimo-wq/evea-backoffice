import MenuPopover from "src/components/MenuPopover";

const TableMenu = ({ open, onClose, children }) => (
  <MenuPopover
    open={Boolean(open)}
    anchorEl={open}
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

export default TableMenu;
