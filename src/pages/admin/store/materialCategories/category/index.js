import {
  Box,
  Button,
  Card,
  Dialog,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import { BodyRow } from "src/components/custom-table";
import DataHandlerTable from "src/components/data-handler/table";
import EmptyTable from "src/components/emptyTable";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";

import { PATH_DASHBOARD } from "src/routes/paths";
import Actions from "./components/Actions";
import Row from "./components/Row";
import { AddForm, EditForm } from "./components/form";
import useList from "./hooks/useList";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";
const headers = [
  "material.no",
  "material.category",
  "material.sort_order",
  "material.action",
];
const Index = () => {
  const theme = useTheme();
  const { state, categoryList, fetchCategoryList, rowStart, ...rest } =
    useList();
  const { data, ...dataProps } = state;
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [categoryId, setCategoriesId] = useState(null);

  const handleClickOpenAddCategory = () => {
    setOpenAddCategory(true);
  };

  const handleCloseAddBusiness = () => {
    setOpenAddCategory(false);
  };

  const [openMenu, setOpenMenuActions] = useState(null);
  const handleOpenMenu = (id) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setCategoriesId(id);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => {
    setOpenEdit(true);
    handleCloseMenu();
  };

  const handleCloseEdit = () => setOpenEdit(false);

  const isEmpty = !Boolean(categoryList?.length);

  return (
    <>
      <Page title={"material.material_categories"}>
        <HeaderBreadcrumbs
          heading={"material.material_categories"}
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            {
              name: "material.materials",
              href: PATH_DASHBOARD.store.material,
            },
            { name: "material.material_categories" },
          ]}
        />
        <Card sx={{ p: 2 }}>
          <Grid container>
            <Grid item sm={12} mr={1} mb={1} mt={1}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  startIcon={<Iconify icon={"eva:plus-fill"} />}
                  onClick={handleClickOpenAddCategory}
                  size="small"
                  name="add-category"
                >
                  <Translate>{"material.add"}</Translate>
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Scrollbar>
            <DataHandlerTable
              name="faq-table"
              headers={headers}
              dataProps={{ ...dataProps }}
            >
              <Map
                list={data}
                render={(item, i) => (
                  <TableRow key={item.id}>
                    <TableCell>{i + rowStart}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.sort_order}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={handleOpenMenu(item.id)}
                        name="more-button"
                      >
                        <Iconify
                          icon={"eva:more-vertical-fill"}
                          width={20}
                          height={20}
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )}
              />
            </DataHandlerTable>
          </Scrollbar>

          <TableMenu onClose={handleCloseMenu} open={openMenu}>
            <Actions
              openEdit={handleOpenEdit}
              categoryId={categoryId}
              reload={fetchCategoryList}
              close={handleCloseMenu}
            />
          </TableMenu>
        </Card>
      </Page>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openAddCategory}
        onClose={handleCloseAddBusiness}
        aria-labelledby="add-category"
        TransitionComponent={Transition}
      >
        <AddForm onClose={handleCloseAddBusiness} reload={fetchCategoryList} />
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="edit-category"
        TransitionComponent={Transition}
      >
        <EditForm
          selectedId={categoryId}
          onClose={handleCloseEdit}
          reload={fetchCategoryList}
        />
      </Dialog>

      <PaginationButtons {...rest} />
    </>
  );
};

export default Index;
