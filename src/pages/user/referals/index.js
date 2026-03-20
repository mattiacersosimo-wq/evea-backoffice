import { Card, IconButton, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import Iconify from "src/components/Iconify";
import TableMenu from "src/components/tableMenu";
import { PATH_DASHBOARD } from "src/routes/paths";
import useReferrals from "./hooks/useCouponPurchase";
import Actions from "./actions";
import ChangeSponsor from "./changeSponsor";

const headers = [
  "global.user",
  "global.email",
  "holding_tank.joinedAt",
  "blogs.categories.table.action",
];

const Referrals = () => {
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
      <Page title="global.referrals">
        <HeaderBreadcrumbs
          heading="global.referrals"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "global.referrals" },
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
                    <TableCell>{row?.username}</TableCell>
                    <TableCell>{row?.email}</TableCell>
                    <TableCell>
                      <ParseDate date={row.created_at} />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={handleOpenMenu(row.id)}
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
        </Card>
        <TableMenu onClose={handleCloseMenu} open={openMenu}>
          <Actions
            status={{ sponsor: true }}
            openSponsor={handleSponsor}
          />
        </TableMenu>
        <ChangeSponsor
          sponsor={selectedUser?.username || ""} 
          onClose={handleCloseSponsorDialog}
          fetchData={fetchData}
          selectedId={selectedUserId}
          open={openSponsorDialog}
        />
        <PaginationButtons {...rest} />
      </Page>
    </div>
  );
};

export default Referrals;