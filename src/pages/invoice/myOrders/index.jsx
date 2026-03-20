import InvoiceDetails from "../invoiceDetails";
import InvoiceBody from "./body";
import useFetchInvoiceDetails from "./hooks/useFetchInvoiceDetails";
import InvoiceTitle from "./title";

import { Container } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_USER } from "src/routes/paths";

const MyOrders = () => {
  const invoice = useFetchInvoiceDetails();

  return (
    <>
      <Page title={"user.online_store.my_orders.details.title"}>
        <Container sx={{ width: "100%" }}>
          <HeaderBreadcrumbs
            heading={"user.online_store.my_orders.details.title"}
            links={[
              { name: "global.dashboard", href: PATH_USER.root },
              {
                name: "user.online_store.my_orders.title",
                href: PATH_USER.my_orders.root,
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

export default MyOrders;
