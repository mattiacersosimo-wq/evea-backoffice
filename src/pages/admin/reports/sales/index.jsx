import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import useReport from "../hooks/use-report";
import ReportFilter from "../report-filter";
import DataList from "./data-list";

const headers = [
  "settings.reports.no",
  "settings.reports.username",
  "settings.reports.email",
  "settings.reports.amount",
  "business.invoice",
  "global.payment_type",
  "settings.reports.date",
];

const Sales = ({ title, heading }) => {
  const { getReport, state, rowStart, sum, ...rest } = useReport("sales", {
    title,
    heading,
  });
  const { data, ...dataProps } = state;

  return (
    <>
      <ReportFilter getReport={getReport} sum={sum} />

      <DataHandlerTable sx={{pt:1}}
        name="sales-table"
        headers={headers}
        dataProps={{ ...dataProps }}
      >
        <Map
          list={data}
          render={(sales, i) => (
            <DataList sales={sales} rowNumber={rowStart + i} />
          )}
        />
      </DataHandlerTable>
      <PaginationButtons {...rest} />
    </>
  );
};

export default Sales;
