import PropTypes from "prop-types";
import { useState } from "react";

import { Box, Button, Card, Dialog, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { PATH_DASHBOARD } from "src/routes/paths";

import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import EmptyTable from "src/components/emptyTable";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import Ternary from "src/components/ternary";
import axiosInstance from "src/utils/axios";
import DeleteDialog from "./Components/DeleteDialog";
import { AddForm, EditForm } from "./Components/Form";
import ProductCategory from "./Components/ProductCategory";
import useGetProductCategories from "./hooks/useGetProductCategories";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const ProductCategories = () => {
  const { productCategories, fetchProductCategories, ...rest } =
    useGetProductCategories();

  const theme = useTheme();

  const isNotFound = !productCategories.length;

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDelete = (id) => () => {
    setOpenDelete(true);
    setSelectedId(id);
  };
  const handleCloseDelete = () => setOpenDelete(false);

  const handleClickOpenAddCategory = () => {
    setOpenAddCategory(true);
  };

  const handleClickOpenEditCategory = (id) => () => {
    setSelectedCategoryId(id);
  };

  const handleCloseAddCategory = () => {
    setOpenAddCategory(false);
  };

  const handleCloseEditCategory = () => {
    setSelectedCategoryId(false);
  };

  const changeStatus = async (id) => {
    try {
      await axiosInstance.get(`api/admin/product-categories-status/${id}`);
    } catch (err) {
      console.log(err);
    }
  };
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const buttonProps = {
    size: isSmallScreen ? "small" : "medium",
  };
  return (
    <>
      <Page title="products.category.product_categories_store">
        <Box sx={{ p: 2 }}>
          <HeaderBreadcrumbs
            heading="products.category.product_categories"
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              { name: "global.product", href: PATH_DASHBOARD.store.products },
              { name: "products.category.product_categories" },
            ]}
            action={
              <Button
                {...buttonProps}
                variant="contained"
                startIcon={
                  <Iconify icon={"eva:plus-fill"} width={20} height={20} />
                }
                onClick={handleClickOpenAddCategory}
                name="category"
              >
                <Translate>products.category.add</Translate>
              </Button>
            }
          />

          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Ternary
                when={isNotFound}
                then={
                  <Box>
                    <EmptyTable title="No Data" />
                  </Box>
                }
                otherwise={
                  <Map
                    list={productCategories}
                    render={(item) => {
                      return (
                        <>
                          <ProductCategory
                            changeStatus={changeStatus}
                            item={item}
                            openEdit={handleClickOpenEditCategory}
                            openDelete={handleOpenDelete}
                          />
                        </>
                      );
                    }}
                  />
                }
              />
            </Grid>
            <PaginationButtons {...rest} />
          </Card>
        </Box>

        <Dialog
          fullWidth
          maxWidth="sm"
          open={openAddCategory}
          onClose={handleCloseAddCategory}
          aria-labelledby="add-category"
          TransitionComponent={Transition}
        >
          <AddForm
            onClose={handleCloseAddCategory}
            refresh={fetchProductCategories}
          />
        </Dialog>

        <Dialog
          fullWidth
          maxWidth="sm"
          open={selectedCategoryId}
          onClose={handleCloseEditCategory}
          aria-labelledby="edit-category"
          TransitionComponent={Transition}
        >
          <EditForm
            onClose={handleCloseEditCategory}
            refresh={fetchProductCategories}
            id={selectedCategoryId}
          />
        </Dialog>

        <DeleteDialog
          fetchData={fetchProductCategories}
          onClose={handleCloseDelete}
          refresh={fetchProductCategories}
          open={openDelete}
          selectedId={selectedId}
        />
      </Page>
    </>
  );
};

ProductCategories.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
  ]),
  icon: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.number,
};

export default ProductCategories;
