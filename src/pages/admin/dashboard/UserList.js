import {
  Card,
  Container,
  Dialog,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import TableMenu from "src/components/tableMenu";
import { PATH_USER } from "src/routes/paths";
import Transition from "src/utils/dialog-animation";

const orders = [
  {
    id: "40-124-5770",
    no: 1,
    payment: "07/23/2022",
    paymentMethod: "Card",
    orderDate: "11/17/2021",
    totalPrice: "$3.01",
  },
  {
    id: "56-967-6789",
    no: 2,
    payment: "07/08/2022",
    paymentMethod: "Card",
    orderDate: "05/26/2022",
    totalPrice: "$8.21",
  },
  {
    id: "55-862-9311",
    no: 3,
    payment: "05/29/2022",
    paymentMethod: "Card",
    orderDate: "03/18/2022",
    totalPrice: "$7.13",
  },
  {
    id: "45-019-6052",
    no: 4,
    payment: "04/11/2022",
    paymentMethod: "Card",
    orderDate: "12/29/2021",
    totalPrice: "$4.80",
  },
  {
    id: "76-236-3754",
    no: 5,
    payment: "09/18/2021",
    paymentMethod: "Card",
    orderDate: "07/22/2022",
    totalPrice: "$5.60",
  },
  {
    id: "80-564-5174",
    no: 6,
    payment: "06/25/2022",
    paymentMethod: "Card",
    orderDate: "10/19/2021",
    totalPrice: "$0.16",
  },
  {
    id: "10-581-9640",
    no: 7,
    payment: "06/13/2022",
    paymentMethod: "Card",
    orderDate: "07/25/2022",
    totalPrice: "$6.80",
  },
  {
    id: "79-976-0916",
    no: 8,
    payment: "11/30/2021",
    paymentMethod: "Cash",
    orderDate: "12/29/2021",
    totalPrice: "$9.33",
  },
  {
    id: "81-979-7047",
    no: 9,
    payment: "03/01/2022",
    paymentMethod: "Card",
    orderDate: "02/03/2022",
    totalPrice: "$5.60",
  },
  {
    id: "21-804-0479",
    no: 10,
    payment: "12/23/2021",
    paymentMethod: "Card",
    orderDate: "07/11/2022",
    totalPrice: "$7.14",
  },
];

export default function UserList() {
  const navigate = useNavigate();

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const [openCombo, setOpenCombo] = useState(false);
  return (
    <Page title="User: List">
      <Container maxWidth="100%">
        <HeaderBreadcrumbs
          heading="My Orders"
          links={[
            { name: "Dashboard", href: PATH_USER.root },
            {
              name: "Subscription",
              href: PATH_USER.onlineStore.productSubscription.root,
            },
            { name: "My Orders" },
          ]}
        />

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: "relative" }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>Invoice Id</TableCell>
                      <TableCell>Payment </TableCell>
                      <TableCell>Payment Method </TableCell>
                      <TableCell>Order Date</TableCell>
                      <TableCell>Total Price</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((row) => {
                      return (
                        <TableRow
                          key={row.no}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.no}
                          </TableCell>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.payment}</TableCell>
                          <TableCell>{row.paymentMethod}</TableCell>
                          <TableCell>{row.orderDate}</TableCell>
                          <TableCell>{row.totalPrice}</TableCell>
                          <TableCell>
                            <IconButton
                              LinkComponent={Link}
                              to={PATH_USER.my_orders.view(
                                "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5"
                              )}
                            >
                              <Iconify icon="carbon:view" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>

      <TableMenu open={openMenu} onClose={handleCloseMenu}>
        <MenuItem
          onClick={() => {
            setOpenCombo(true);
          }}
        >
          <Iconify icon="carbon:view" />
          Combo
        </MenuItem>
        <MenuItem onClick={() => navigate("view")}>
          <Iconify icon="carbon:view" />
          View
        </MenuItem>
      </TableMenu>

      <Dialog
        open={openCombo}
        onClose={() => setOpenCombo(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>Combo</DialogTitle>
      </Dialog>
    </Page>
  );
}
