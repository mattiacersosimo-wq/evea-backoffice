import { Card, IconButton, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import { PATH_DASHBOARD } from "src/routes/paths";
import useReferrals from "./hooks/useCouponPurchase";

const headers = [
  "global.username",
  "financial.e_wallet.table.from",
  "search.amount_type",
  "global.payment_type",
  "global.amount",
  "global.Dates",
];

const PendingCommissions = () => {
  const { state, fetchData, rowStart, ...rest } = useReferrals();
  const { data, ...dataProps } = state;
  const [openMenu, setOpenMenuActions] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openSponsorDialog, setOpenSponsorDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenMenu = (id) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setSelectedUserId(id);
    const user = data.find((row) => row.id === id);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
    setSelectedUser(null);
  };

  const handleSponsor = () => {
    setOpenSponsorDialog(true);
    handleCloseMenu();
  };

  const handleCloseSponsorDialog = () => {
    setOpenSponsorDialog(false);
  };

  return (
    <div>
      <Page title="global.pendingcommissions">
        <HeaderBreadcrumbs
          heading="global.pendingcommissions"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "global.pendingcommissions" },
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
                    <TableCell>{row?.user?.username}</TableCell>
                    <TableCell>{row?.from_user?.username}</TableCell>
                    <TableCell>{row?.type}</TableCell>
                    <TableCell>{row?.payment_type}</TableCell>
                    <TableCell>{row?.total_amount}</TableCell>
                    <TableCell>
                      <ParseDate date={row.created_at} />
                    </TableCell>
                  </TableRow>
                )}
              />
            </DataHandlerTable>
          </Scrollbar>
        </Card>
        <PaginationButtons {...rest} />
      </Page>
    </div>
  );
};

export default PendingCommissions;
