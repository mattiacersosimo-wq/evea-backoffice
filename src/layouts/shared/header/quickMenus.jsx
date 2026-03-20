import { ListItemIcon, ListItemText, MenuItem, Stack } from "@mui/material";
import { capitalCase } from "change-case";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import { PATH_DASHBOARD } from "src/routes/paths";

const QuickMenus = () => {
  return (
    <Stack spacing={0.75}>
      {menuItems.map(({ icon, text, to }) => (
        <MenuItem
          component={Link}
          to={to}
          sx={{
            mr: 1,
            color: "text.disabled",
          }}
        >
          <ListItemIcon>
            <Iconify fontSize={20} icon={icon} />
          </ListItemIcon>
          <ListItemText
            primary={capitalCase(text)}
            sx={{
              "& > *": {
                fontWeight: "bold",
              },
            }}
          />
        </MenuItem>
      ))}
    </Stack>
  );
};

const menuItems = [
  {
    to: PATH_DASHBOARD.store.products,
    icon: "material-symbols:shopping-cart-outline",
    text: "products",
  },
  {
    to: PATH_DASHBOARD.store.material,
    icon: "material-symbols:folder-outline",
    text: "materials",
  },
  {
    to: PATH_DASHBOARD.communication.help_center,
    icon: "bx:support",
    text: "helpCenter",
  },
  {
    to: PATH_DASHBOARD.settings.network.root,
    icon: "material-symbols:settings",
    text: "networkSettings",
  },
];

export default QuickMenus;
