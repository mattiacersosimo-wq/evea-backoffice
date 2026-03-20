import {
  Box,
  Card,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import PaginationButtons from "src/components/pagination";
import usePagination from "src/components/pagination/usePagination";

import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";

const Index = () => {
  const [list, setEventsList] = useState([]);
  const [eventId, setEventId] = useState(null);
  const { count, onChange, page, rowStart, seed, ...rest } = usePagination();

  const fetchData = async (page = 1) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/salespage?page=${page}`
      );
      const { status, data: events } = data;
      if (status) {
        const { data: list, last_page, from } = events;
        seed(last_page, from);
        setEventsList(list);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);
  return (
    <>
      <Page title={"subFinancial.eWallet.salesTitile"}>
        <Box sx={{ p: 2 }}>
          <HeaderBreadcrumbs
            heading={"subFinancial.eWallet.sales"}
            links={[
              { name: "dashboard", href: PATH_DASHBOARD.root },
              { name: "subFinancial.eWallet.sales" },
            ]}
          />

          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title={"adminDashboard.latestSales"}
                    sx={{ mb: 2 }}
                  />
                  <Box>
                    <Scrollbar>
                      <TableContainer sx={{ minWidth: "100%" }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>{"adminDashboard.no"}</TableCell>
                              <TableCell>{"adminDashboard.invoice"}</TableCell>
                              <TableCell>
                                {"adminDashboard.paymentMethod"}
                              </TableCell>
                              <TableCell>{"adminDashboard.userName"}</TableCell>
                              <TableCell>{"adminDashboard.price"}</TableCell>
                              <TableCell>{"adminDashboard.date"}</TableCell>
                              <TableCell />
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {list.length > 0
                              ? list.map((row, i) => (
                                  <TableRow key={row.id}>
                                    <TableCell>{i + rowStart}</TableCell>
                                    <TableCell>{row.invoice_id}</TableCell>
                                    <TableCell>
                                      {row.payment_type?.name}
                                    </TableCell>
                                    <TableCell>{row.user?.username}</TableCell>
                                    <TableCell>{row.total_amount}</TableCell>
                                    <TableCell>
                                      {new Date(
                                        row.created_at
                                      ).toLocaleDateString("en-GB")}
                                    </TableCell>
                                  </TableRow>
                                ))
                              : null}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Scrollbar>
                  </Box>
                  <Box>
                    <PaginationButtons
                      count={count}
                      onChange={onChange}
                      page={page}
                      sx={{ mb: 2, mr: 3 }}
                    />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Page>
    </>
  );
};

export default Index;
