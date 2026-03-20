import { Box, Button, Card, Divider, Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import ReactToPrint from "react-to-print";
import Iconify from "src/components/Iconify";
import { InvoiceFooter, InvoiceTable } from "src/components/invoice";
import ShippingAddress from "./myOrders/ShippingAddress";
const headings = [
  "user.online_store.my_orders.invoice_details.item",
  "user.online_store.my_orders.invoice_details.type",
  "user.online_store.my_orders.invoice_details.price",
  "user.online_store.my_orders.invoice_details.quantity",
  "user.online_store.my_orders.invoice_details.bv",
  "user.online_store.my_orders.invoice_details.qv",
  "user.online_store.my_orders.invoice_details.ev",
  "user.online_store.my_orders.invoice_details.total",
];

const InvoiceDetails = ({ invoice, BodyComponent, TitleComponent }) => {
  let componentRef = useRef();

  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: "row", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        sx={{ mb: 5 }}
      >
        {/* <InvoiceToolbar /> */}
        <Box />
        <ReactToPrint
          trigger={() => (
            <Button
              variant="contained"
              startIcon={<Iconify icon="tabler:download" />}
              size="small"
            >
              Download
            </Button>
          )}
          content={() => componentRef}
        />
      </Stack>

      <Card sx={{ pt: 5, px: 5 }} ref={(el) => (componentRef = el)}>
        <TitleComponent invoice={invoice} />

        <InvoiceTable
          body={<BodyComponent invoice={invoice} />}
          headings={headings}
        />
        <ShippingAddress invoice={invoice} />

        <Divider sx={{ mt: 5 }} />

        <InvoiceFooter />
      </Card>
    </>
  );
};

export default InvoiceDetails;
