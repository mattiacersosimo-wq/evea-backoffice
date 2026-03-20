import {
  Box,
  Button,
  Card,
  Dialog,
  Grid,
  IconButton,
  TableCell,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";
import { Currency } from "src/components/with-prefix";

import Actions from "./components/Actions";
import { AddForm, EditForm } from "./components/form";
import useList from "./hooks/useList";
import Translate from "src/components/translate";
import Transition from "src/utils/dialog-animation";

const headers = [
  "settings.business_builder.no",
  "settings.business_builder.name",
  "settings.business_builder.amount",
  "settings.business_builder.bv",
  "settings.business_builder.action",
];

const Index = () => {
  const theme = useTheme();

  const { state, fetchBusinessList, rowStart, ...rest } = useList();
  const { data, ...dataProps } = state;
  const [openAddBusiness, setOpenAddBusiness] = useState(false);
  const [businessId, setCategoriesId] = useState(null);

  const handleClickOpenAddBusiness = () => {
    setOpenAddBusiness(true);
  };

  const handleCloseAddBusiness = () => {
    setOpenAddBusiness(false);
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

  return (
    <>
      <Grid container>
        <Grid item sm={12} mr={1} mb={1} mt={1}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              startIcon={<Iconify icon={"eva:plus-fill"} />}
              onClick={handleClickOpenAddBusiness}
              name="add"
            >
              <Translate>{"settings.business_builder.add"}</Translate>
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Card>
        <Box sx={{ p: 1 }}>
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
                    <TableCell>
                      <Currency>{item.amount}</Currency>
                    </TableCell>
                    <TableCell>{item.bv}</TableCell>
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
        </Box>

        <TableMenu onClose={handleCloseMenu} open={openMenu}>
          <Actions
            openEdit={handleOpenEdit}
            businessId={businessId}
            reload={fetchBusinessList}
            close={handleCloseMenu}
          />
        </TableMenu>
      </Card>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openAddBusiness}
        onClose={handleCloseAddBusiness}
        aria-labelledby="add-business"
        TransitionComponent={Transition}
      >
        <AddForm onClose={handleCloseAddBusiness} reload={fetchBusinessList} />
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="add-business"
        TransitionComponent={Transition}
      >
        <EditForm
          selectedId={businessId}
          onClose={handleCloseEdit}
          reload={fetchBusinessList}
        />
      </Dialog>

      <PaginationButtons {...rest} />
    </>
  );
};

export default Index;
