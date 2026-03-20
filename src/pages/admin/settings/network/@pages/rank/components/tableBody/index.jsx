import { TableCell } from "@mui/material";
import { BodyRow } from "src/components/custom-table";
import EmptyTable from "src/components/emptyTable";
import Row from "./components/row";
import useRankSettings from "./hooks/useRankSettings";
import useUpdateRankSettings from "./hooks/useUpdateRankSettings";

const TableBody = ({ data, dataProduct, setDataProduct }) => {
  // const data = useRankSettings();
  // const onSubmit = useUpdateRankSettings();
  const isEmpty = !Boolean(data?.length);

  return (
    <>
      {isEmpty ? (
        <BodyRow>
          <TableCell align="center" colSpan={7}>
            <EmptyTable title="No Data Available" />
          </TableCell>
        </BodyRow>
      ) : (
        <tbody>
          {data.map((item) => (
            <Row
              {...item}
              dataProduct={dataProduct}
              setDataProduct={setDataProduct}
            />
          ))}
        </tbody>
      )}
    </>
  );
};

export default TableBody;
