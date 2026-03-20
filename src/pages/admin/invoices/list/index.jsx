import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogTitle,
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";
import Ternary from "src/components/ternary";
import { Currency } from "src/components/with-prefix";
import { PATH_DASHBOARD } from "src/routes/paths";
import Transition from "src/utils/dialog-animation";
import DataFilter from "./components/dataFilter";
import useFilter from "./hooks/use-filter";
import useMyOrders from "./hooks/useMyOrders";
import ChangeDateDialog from "./components/changeDateDialog";
import { capitalCase } from "change-case";

const headers = [
  "global.no",
  "global.product",
  "global.invoice_id",
  "global.username",
  "global.payment_method",
  "search.status",
  "global.order_date",
  "",
  "global.total_price",
  "global.action",
];

const MyOrders = () => {
  const navigate = useNavigate();

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };
  const methods = useFilter();
  const filter = methods.watch();
  const [openCombo, setOpenCombo] = useState(false);
  const { state, fetchData, rowStart, ...rest } = useMyOrders(filter);
  const { data, ...dataProps } = state;

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [openChangeDate, setOpenChangeDate] = useState(false);

  const handleOpenChangeDate = (id) => () => {
    setSelectedOrderId(id);
    setOpenChangeDate(true);
  };

  const handleCloseChangeDate = () => {
    setOpenChangeDate(false);
    setSelectedOrderId(null);
  };

  const onFilter = methods.handleSubmit(
    async (inputData) => await fetchData(1, inputData),
  );

  return (
    <Page title={"nav.my_orders.completed_orders"}>
      <Box maxWidth="100%">
        <HeaderBreadcrumbs
          heading={"nav.my_orders.completed_orders"}
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "nav.my_orders.completed_orders" },
          ]}
        />

        <Card>
          <DataFilter methods={methods} onFilter={onFilter} />
          <Scrollbar>
            <DataHandlerTable
              name="faq-table"
              headers={headers}
              dataProps={{ ...dataProps }}
            >
              <Map
                list={data}
                render={(row, i) => (
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {i + rowStart}
                    </TableCell>
                    <TableCell>
                      <Ternary
                        when={row?.purchase_type === "coupon_purchase"}
                        then="Coupon Purchase"
                        otherwise={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {row?.user_purchase_products[0]?.product?.name}
                            {row?.product_count == "1" ? null : (
                              <span
                                style={{
                                  margin: "2px",
                                  maxWidth: "calc(100% - 4px)",
                                  lineHeight: "1.4375em",
                                  fontSize: "0.8rem",
                                  fontWeight: 400,
                                }}
                              >
                                +{parseInt(row?.product_count) - 1}
                              </span>
                            )}
                          </Box>
                        }
                      />
                    </TableCell>
                    <TableCell>{row?.invoice_id}</TableCell>
                    <TableCell>{row?.user?.username}</TableCell>
                    <TableCell>{row?.payment_type?.name}</TableCell>
                    <TableCell>
                      <Ternary
                        when={row?.user_payment?.payment_status == "finished"}
                        then={"Completed"}
                        otherwise={capitalCase(
                          row?.user_payment?.payment_status,
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <ParseDate date={row?.date} />
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleOpenChangeDate(row.id)}
                      >
                        Change Date
                      </Button>
                    </TableCell>

                    <TableCell>
                      <Currency>{row?.total_amount}</Currency>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        LinkComponent={Link}
                        to={PATH_DASHBOARD.store.invoices_edit(row.id)}
                        name="more-button"
                      >
                        <Iconify icon="carbon:view" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )}
              />
            </DataHandlerTable>
          </Scrollbar>
        </Card>
        <PaginationButtons {...rest} />
      </Box>

      <TableMenu open={openMenu} onClose={handleCloseMenu}>
        <MenuItem
          onClick={() => {
            setOpenCombo(true);
          }}
          name="combo"
        >
          <Iconify icon="carbon:view" />
          {"usersMyOrders.combo"}
        </MenuItem>
        <MenuItem onClick={() => navigate("view")} name="view">
          <Iconify icon="carbon:view" />
          {"usersMyOrders.view"}
        </MenuItem>
      </TableMenu>

      <Dialog
        open={openCombo}
        onClose={() => setOpenCombo(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>{"usersMyOrders.combo"}</DialogTitle>
      </Dialog>

      <ChangeDateDialog
        open={openChangeDate}
        onClose={handleCloseChangeDate}
        selectedId={selectedOrderId}
        reload={() => fetchData()}
      />
    </Page>
  );
};

export default MyOrders;
