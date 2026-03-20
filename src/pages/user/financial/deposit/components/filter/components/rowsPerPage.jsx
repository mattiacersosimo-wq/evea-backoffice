import React from "react";
import { RHFSelect } from "src/components/hook-form";
import Map from "src/components/map";

const values = [10, 25, 50, 100, 200];

const RowsPerPage = () => {
  return (
    <RHFSelect
      name="rows_page"
      label={"userFinancial.eWallet.numberOfRows"}
      size="small"
    >
      <Map list={values} render={(v) => <option value={v}>{v}</option>} />
    </RHFSelect>
  );
};

export default RowsPerPage;
