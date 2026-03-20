import React, { useState } from "react";
import {
  Box,
  Card,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import Iconify from "src/components/Iconify";
import Map from "src/components/map";
import ParseDate from "src/components/date";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import { useTranslation } from "react-i18next";

const headers = [
  "affiliate_dashboard.s_no",
  "affiliate_dashboard.customer_name",
  "affiliate_dashboard.bv",
  "affiliate_dashboard.commission",
  "affiliate_dashboard.order_date",
];

const CustomerDetails = ({ customer = [], state }) => {
  const [open, setOpen] = useState(false);
  const { data, ...dataProps } = state;
  const { t } = useTranslation();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          pt: 3,
        }}
      >
        <Typography variant="subtitle1">
          {t("affiliate_dashboard.customer_details")}
        </Typography>
        <IconButton
          onClick={() => setOpen((prev) => !prev)}
          size="small"
          sx={{
            ml: 2,
            backgroundColor: "#cccccc47",
            transition: "transform 0.4s ease-in-out",
            transform: open ? "rotate(0deg)" : "rotate(180deg)",
          }}
        >
          <Iconify icon="ep:arrow-up-bold" />
        </IconButton>
      </Box>
      <Collapse in={open} collapsedSize={0}>
        <Card sx={{ pt: 1, mt: 2 }}>
          <Scrollbar>
            <DataHandlerTable
              name="faq-table"
              headers={headers}
              dataProps={{ ...dataProps, isArrayEmpty: !customer?.length }}
            >
              <Map
                list={customer}
                render={(customer, customer_index) => (
                  <Map
                    list={customer?.orders}
                    render={(item, i) => (
                      <>
                        <TableRow key={item.id}>
                          <TableCell>{customer_index + i + 1}</TableCell>
                          <TableCell>{item?.username}</TableCell>
                          <TableCell>{item?.bv}</TableCell>
                          <TableCell>{item?.commission}</TableCell>
                          <TableCell>
                            <ParseDate date={item?.order_date} />
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  />
                )}
              />
            </DataHandlerTable>
          </Scrollbar>
        </Card>
      </Collapse>
    </>
  );
};

export default CustomerDetails;
