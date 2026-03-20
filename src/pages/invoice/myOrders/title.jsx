import React from "react";
import { InvoiceTitleBar } from "src/components/invoice";

const InvoiceTitle = ({ invoice }) => {
  const { invoice_id: invoiceNumber, date: createDate, email } = invoice || {};

  return (
    <InvoiceTitleBar
      date={createDate}
      invoiceNumber={invoiceNumber}
      email={email}
    />
  );
};

export default InvoiceTitle;
