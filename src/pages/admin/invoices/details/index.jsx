import useFetchInvoiceDetails from "./hooks/useFetchInvoiceDetails";

import { Container } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import InvoiceDetails from "src/pages/invoice/invoiceDetails";
import InvoiceBody from "src/pages/invoice/myOrders/body";
import InvoiceTitle from "src/pages/invoice/myOrders/title";

import { PATH_DASHBOARD } from "src/routes/paths";

const SingleView = () => {
  const invoice = useFetchInvoiceDetails();

  return (
    <>
      <Page title={"user.online_store.my_orders.details.title"}>
        <Container sx={{ width: "100%" }}>
          <HeaderBreadcrumbs
            heading={"user.online_store.my_orders.details.title"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              {
                name: "nav.my_orders.orders",
                href: PATH_DASHBOARD.store.invoices,
              },
              { name: invoice?.invoice_id || "" },
            ]}
          />
          <InvoiceDetails
            invoice={invoice}
            BodyComponent={InvoiceBody}
            TitleComponent={InvoiceTitle}
          />
        </Container>
      </Page>
    </>
  );
};

export default SingleView;
