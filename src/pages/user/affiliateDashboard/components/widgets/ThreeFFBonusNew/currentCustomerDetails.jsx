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
import Map from "src/components/map";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import { useTranslation } from "react-i18next";

const headers = [
  "affiliate_dashboard.s_no",
  "affiliate_dashboard.customer_name",
  "affiliate_dashboard.euro_value",
];

const CurrentCustomerDetails = ({ customerDetails = [], state }) => {
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
              dataProps={{
                ...dataProps,
                isArrayEmpty: !customerDetails?.length,
              }}
            >
              <Map
                list={customerDetails}
                render={(item, i) => (
                  <>
                    <TableRow key={item.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{item?.customer_name}</TableCell>
                      <TableCell>{item?.ev_for_3ff}</TableCell>
                    </TableRow>
                  </>
                )}
              />
            </DataHandlerTable>
          </Scrollbar>
        </Card>
      </Collapse>
    </>
  );
};

export default CurrentCustomerDetails;
