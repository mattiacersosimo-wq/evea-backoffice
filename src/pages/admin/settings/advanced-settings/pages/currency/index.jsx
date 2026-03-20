import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import Translate from "src/components/translate";
import AddDialog from "./components/add-dialog";
import DeleteDialog from "./components/delete-dialog";
import EditDialog from "./components/edit-dialog";
import useWithdrawal from "./hooks/use-currency";

const headers = [
  "settings.currency.no",
  "settings.currency.name",
  "settings.currency.code",
  "settings.currency.symbol",
  "settings.currency.status",
  "settings.currency.exchange_rate",
  "settings.currency.action",
];

const Withdraw = () => {
  const { state, fetchData } = useWithdrawal();
  const [openMenu, setOpenMenu] = useState(null);
  const { data, ...dataProps } = state;
  const [selectedId, setSelectedId] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const closeMenu = () => {
    setOpenMenu(null);
    setSelectedId(null);
  };

  const closeEdit = () => {
    setOpenEdit(false);
    setSelectedId(null);
  };
  const closeDelete = () => {
    setOpenDelete(false);
    setSelectedId(null);
  };

  const closeAdd = () => {
    setOpenAdd(false);
  };
  const { t } = useTranslation();
  return (
    <>
      <Box
        sx={{
          width: "100%",
          textAlign: "right",
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-fill" />}
          onClick={() => {
            setOpenAdd(true);
          }}
        >
          <Translate>settings.currency.add</Translate>
        </Button>
      </Box>
      <DataHandlerTable headers={headers} dataProps={dataProps} sx={{ pt: 1 }}>
        <Map
          list={data}
          render={(data, i) => {
            const { name, code, symbol, is_enable, exchange_rate, id } = data;
            return (
              <TableRow key={code}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>{code}</TableCell>
                <TableCell>{symbol}</TableCell>
                <TableCell>
                  {is_enable === 1
                    ? t("settings.currency.enabled")
                    : t("settings.currency.disabled")}
                </TableCell>
                <TableCell>{exchange_rate}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      setSelectedId(id);
                      setOpenMenu(e.currentTarget);
                    }}
                  >
                    <Iconify icon="mingcute:more-2-fill" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          }}
        />
      </DataHandlerTable>

      <Menu onClose={closeMenu} open={Boolean(openMenu)} anchorEl={openMenu}>
        <MenuItem
          onClick={() => {
            setOpenEdit(true);
            setOpenMenu(null);
          }}
          sx={{ marginRight: 1, color: "default.main" }}
        >
          <Iconify icon={"akar-icons:edit"} />
          <Translate>settings.currency.edit</Translate>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenDelete(true);
            setOpenMenu(null);
          }}
          sx={{ marginRight: 1, color: "error.main" }}
        >
          <Iconify icon={"eva:trash-2-outline"} />
          <Translate>settings.currency.delete</Translate>
        </MenuItem>
      </Menu>

      <AddDialog fetchData={fetchData} open={openAdd} handleClose={closeAdd} />

      <EditDialog
        fetchData={fetchData}
        open={openEdit}
        handleClose={closeEdit}
        selectedId={selectedId}
      />

      <DeleteDialog
        reload={fetchData}
        open={openDelete}
        selectedId={selectedId}
        onClose={closeDelete}
      />
    </>
  );
};

export default Withdraw;
