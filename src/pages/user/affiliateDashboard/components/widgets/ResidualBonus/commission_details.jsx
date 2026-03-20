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
import DataHandlerTable from "src/components/data-handler/table";
import Scrollbar from "src/components/Scrollbar";
import { Currency } from "src/components/with-prefix";
import { useTranslation } from "react-i18next";

const headers = [
  "affiliate_dashboard.s_no",
  "affiliate_dashboard.from_user",
  "affiliate_dashboard.amount_payable",
];

const CommissionDetails = ({ commission = [], state }) => {
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
          {t("affiliate_dashboard.current_month_commissions")}
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
              dataProps={{ ...dataProps }}
            >
              <Map
                list={commission}
                render={(item, i) => (
                  <>
                    <TableRow key={item.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{item?.from_username}</TableCell>
                      <TableCell>
                        <Currency>{item?.payable_amount}</Currency>
                      </TableCell>
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

export default CommissionDetails;
