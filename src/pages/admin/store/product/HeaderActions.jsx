import { Box, Button, Menu, MenuItem } from "@mui/material";
import React, { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import Iconify from "src/components/Iconify";
import useIsPackage from "src/components/package-or-product/hooks/use-is-package";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

import { PATH_DASHBOARD } from "src/routes/paths";
import { isMenuActive } from "src/utils/actionProtector";
import ShowForPackage from "src/components/package-or-product/show-for-package";

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    addPackage: test("add-package"),
    addProduct: test("add-product"),
    addCategory: test("add-category"),
  };
};
const HeaderActions = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isPackage = useIsPackage();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { addCategory, addPackage, addProduct, allDisabled } = useMemo(() => {
    if (isPackage) {
      const status = genStatus("nav.store.title", "nav.store.packages");
      const { addCategory, addPackage } = status;

      return {
        allDisabled: addCategory || addPackage,
        addCategory,
        addPackage,
      };
    }
    const status = genStatus("nav.store.title", "nav.store.products");
    const { addCategory, addProduct } = status;

    return {
      allDisabled: addCategory || addProduct,
      addCategory,
      addProduct,
    };
  }, [isPackage]);

  return (
    <>
      <Box
        sx={{
          display: "grid",
          columnGap: 1,
          rowGap: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(1, 1fr)",
          },
        }}
      >
        <ShowForPackage>
          <Ternary
            when={allDisabled}
            then={
              <Button
                variant="contained"
                name="add"
                startIcon={<Iconify icon={"eva:plus-fill"} />}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <Translate>products.title.add</Translate>
              </Button>
            }
          />
        </ShowForPackage>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <Ternary
            when={addPackage && isPackage}
            then={
              <MenuItem
                onClick={handleClose}
                component={RouterLink}
                to={PATH_DASHBOARD.store.packages_add}
                name="combo-product"
              >
                <Translate>products.title.package</Translate>
              </MenuItem>
            }
          />

          <Ternary
            when={addProduct && !isPackage}
            then={
              <MenuItem
                onClick={handleClose}
                component={RouterLink}
                to={PATH_DASHBOARD.store.product_add}
                name="product"
              >
                <Translate>products.title.product</Translate>
              </MenuItem>
            }
          />

          {/* <Ternary
            when={addCategory}
            then={
              <MenuItem
                onClick={handleClose}
                component={RouterLink}
                to={PATH_DASHBOARD.store.product_categories}
                name="category"
              >
                <Translate>products.title.category</Translate>
              </MenuItem>
            }
          /> */}
        </Menu>

        {/* <Button
          component={RouterLink}
          to={PATH_DASHBOARD.store.product_add}
          variant="contained"
          startIcon={<Iconify icon={"eva:plus-fill"} />}
        >
          Product
        </Button>

        <Button
          component={RouterLink}
          to={PATH_DASHBOARD.store.product_combo}
          variant="contained"
          startIcon={<Iconify icon={"eva:plus-fill"} />}
        >
          Combo Product
        </Button>
        <Button
          variant="contained"
          startIcon={<Iconify icon={"carbon:add"} />}
          component={RouterLink}
          to={PATH_DASHBOARD.store.product_categories}
        >
          Category
        </Button> */}
      </Box>
    </>
  );
};

export default HeaderActions;
