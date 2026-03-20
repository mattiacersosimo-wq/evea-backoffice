import {
  Box,
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
import { Currency } from "src/components/with-prefix";

import Ternary from "src/components/ternary";
import { PATH_DASHBOARD, PATH_USER } from "src/routes/paths";
import Transition from "src/utils/dialog-animation";
import useMyOrders from "./hooks/useMyOrders";

const headers = [
  "global.no",
  "global.invoice_id",
  "global.product",
  "global.payment_method",
  "global.order_date",
  "global.total_price",
  "global.action",
];

const MyOrders = () => {
  const navigate = useNavigate();

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const [openCombo, setOpenCombo] = useState(false);
  const { state, fetchData, rowStart, ...rest } = useMyOrders();
  const { data, ...dataProps } = state;

  return (
    <Page title={"user.online_store.my_orders.title"}>
      <HeaderBreadcrumbs
        heading="user.online_store.my_orders.title"
        links={[
          { name: "global.dashboard", href: PATH_DASHBOARD.root },
          { name: "user.online_store.my_orders.title" },
        ]}
      />
      <Card sx={{ pt: 1 }}>
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
                  <TableCell>{row.invoice_id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Ternary
                        when={row?.purchase_type === "coupon_purchase"}
                        then="Coupon Purchase"
                        otherwise={
                          row?.user_purchase_products[0]?.product?.name
                        }
                      />
                      {row?.user_purchase_products?.product?.name}
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
                  </TableCell>
                  <TableCell>{row.payment_type?.name}</TableCell>
                  <TableCell>
                    <ParseDate date={row.date} />
                  </TableCell>
                  <TableCell>
                    <Currency>{row.total_amount}</Currency>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      LinkComponent={Link}
                      to={PATH_USER.my_orders.view(row.id)}
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
    </Page>
  );
};

export default MyOrders;
