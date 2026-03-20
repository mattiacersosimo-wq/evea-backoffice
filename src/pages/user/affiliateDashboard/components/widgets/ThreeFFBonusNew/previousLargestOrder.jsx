import React from "react";
import { Box, Card, TableCell, TableRow, Typography } from "@mui/material";
import Map from "src/components/map";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import { useTranslation } from "react-i18next";

const headers = [
  "affiliate_dashboard.s_no",
  "affiliate_dashboard.customer_name",
  "affiliate_dashboard.euro_value",
];

const PreviousLargestOrder = ({ order = [], state }) => {
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
          {t("affiliate_dashboard.largest_order_details")}
        </Typography>
      </Box>
      <Card sx={{ pt: 1, mt: 2 }}>
        <Scrollbar>
          <DataHandlerTable
            name="faq-table"
            headers={headers}
            dataProps={{ ...dataProps, isArrayEmpty: !order?.length }}
          >
            <Map
              list={order}
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
    </>
  );
};

export default PreviousLargestOrder;
