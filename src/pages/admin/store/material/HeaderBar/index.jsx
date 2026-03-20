import { Button, Stack } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link as RouterLink } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

import { PATH_DASHBOARD } from "src/routes/paths";
import { isMenuActive } from "src/utils/actionProtector";

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    addCategory: test("add-category"),
    addMaterial: test("add-material"),
  };
};

const HeaderBarActions = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const buttonProps = {
    size: isSmallScreen ? "small" : "medium",
  };

  const { addMaterial, addCategory } = genStatus(
    "nav.store.title",
    "nav.store.materials"
  );

  return (
    <Stack direction="row" spacing={1}>
      <Ternary
        when={addMaterial}
        then={
          <Button
            {...buttonProps}
            variant="contained"
            size="small"
            startIcon={<Iconify icon={"eva:plus-fill"} />}
            component={RouterLink}
            to={PATH_DASHBOARD.store.material_add}
            name="add"
          >
            <Translate>material.material</Translate>
          </Button>
        }
      />

      <Ternary
        when={addCategory}
        then={
          <Button
            {...buttonProps}
            variant="contained"
            size="small"
            startIcon={<Iconify icon={"eva:plus-fill"} />}
            component={RouterLink}
            to={PATH_DASHBOARD.store.material_categories}
            name="category"
          >
            <Translate>material.material_categories</Translate>
          </Button>
        }
      />
    </Stack>
  );
};

const HeaderBar = () => {
  const links = [
    { name: "global.dashboard", href: PATH_DASHBOARD.root },
    { name: "material.materials" },
  ];
  return (
    <HeaderBreadcrumbs
      heading={"material.materials"}
      links={links}
      action={<HeaderBarActions />}
    />
  );
};

export default HeaderBar;
