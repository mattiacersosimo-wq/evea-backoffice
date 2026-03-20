import React from "react";
import { InvoiceTitleBar } from "src/components/invoice";

const InvoiceTitle = ({ invoice }) => {
  const { invoice_id, invoice_date } = invoice || {};

  return <InvoiceTitleBar date={invoice_date} invoiceNumber={invoice_id} />;
};

export default InvoiceTitle;
