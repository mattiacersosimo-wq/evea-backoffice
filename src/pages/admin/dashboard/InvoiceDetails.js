import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import useErrors from "src/hooks/useErrors";

import { PATH_USER } from "src/routes/paths";
import Invoice from "src/sections/@dashboard/invoice/details";
import fetchUser from "src/utils/fetchUser";

const useFetchInvoiceDetails = () => {
  const [invoice, setInvoice] = useState();
  const { id } = useParams();
  const handleErrors = useErrors();
  const fetchData = async (id) => {
    try {
      const { data, status } = await (await fetchUser(`my-orders/${id}`)).data;
      if (status) {
        setInvoice(data);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    fetchData(id);
  }, [id]);

  return invoice;
};
export default function InvoiceDetails() {
  const invoice = useFetchInvoiceDetails();
  return (
    <Page title={"usersMyOrders.invoiceTitile"}>
      <Container sx={{ width: "100%" }}>
        <HeaderBreadcrumbs
          heading={"usersMyOrders.invoiceDetails"}
          links={[
            { name: "dashboard", href: PATH_USER.root },
            {
              name: "usersMyOrders.invoices",
              href: PATH_USER.my_orders.root,
            },
            { name: invoice?.invoice_id || "" },
          ]}
        />

        <Invoice invoice={invoice} />
      </Container>
    </Page>
  );
}
