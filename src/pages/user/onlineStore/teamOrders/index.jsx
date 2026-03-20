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
import DataFilter from "./components/filter";
import useFilter from "../pending-payments/components/hooks/use-filter";

const headers = [
  "global.no",
  // "global.invoice_id",
  "global.username",
  "global.product",
  "global.bonus_value",
  "global.qualification_value",
  "global.euro_value",
  "global.payment_method",
  "global.order_date",
  "global.total_price",
];

const TeamOrders = () => {
  const methods = useFilter();
  const filter = methods.watch();

  const navigate = useNavigate();

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const [openCombo, setOpenCombo] = useState(false);
  const { state, fetchData, rowStart, ...rest } = useMyOrders(filter);
  const { data, ...dataProps } = state;

  const onFilter = methods.handleSubmit(async (inputData) => {
    await fetchData(1, inputData);
  });

  return (
    <Page title={"user.online_store.team_orders.title"}>
      <HeaderBreadcrumbs
        heading="user.online_store.team_orders.title"
        links={[
          { name: "global.dashboard", href: PATH_DASHBOARD.root },
          { name: "user.online_store.team_orders.title" },
        ]}
      />
      <Card sx={{ pt: 1 }}>
        <DataFilter methods={methods} onFilter={onFilter} isWallet="ewallet" />
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
                  {/* <TableCell>{row.invoice_id}</TableCell> */}
                  <TableCell>{row.user?.username}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Ternary
                        when={row?.purchase_type === "coupon_purchase"}
                        then="Coupon Purchase"
                        otherwise={
                          row?.user_purchase_products[0]?.product?.name
                        }
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{row.total_cv}</TableCell>
                  <TableCell>{row.total_qv}</TableCell>
                  <TableCell>{row.total_ev}</TableCell>
                  <TableCell>{row.payment_type?.name}</TableCell>
                  <TableCell>
                    <ParseDate date={row.date} />
                  </TableCell>
                  <TableCell>
                    <Currency>{row.total_amount}</Currency>
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

export default TeamOrders;
