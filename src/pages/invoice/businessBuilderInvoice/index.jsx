import InvoiceDetails from "../invoiceDetails";
import InvoiceBody from "./body";
import useFetchInvoiceDetails from "./hooks/useFetchInvoiceDetails";
import InvoiceTitle from "./title";

const headings = ["Business Builder", "User", "Period", "Price"];

const BusinessBuilderInvoice = () => {
  const invoice = useFetchInvoiceDetails();
  return (
    <InvoiceDetails
      invoice={invoice}
      BodyComponent={InvoiceBody}
      TitleComponent={InvoiceTitle}
      headings={headings}
    />
  );
};

export default BusinessBuilderInvoice;
