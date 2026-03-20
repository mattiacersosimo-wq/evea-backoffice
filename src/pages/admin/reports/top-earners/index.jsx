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
];

const TopEarners = ({ title, heading }) => {
  const { getReport, state, rowStart, sum, ...rest } = useReport("earners", {
    title,
    heading,
  });
  const { data, ...dataProps } = state;

  return (
    <>
      <ReportFilter getReport={getReport} sum={sum} />
      <DataHandlerTable sx={{pt:1}}
        name="topearners-table"
        headers={headers}
        dataProps={{ ...dataProps }}
      >
        <Map
          list={data}
          render={(topearner, i) => (
            <DataList topearner={topearner} rowNumber={rowStart + i} />
          )}
        />
      </DataHandlerTable>
      <PaginationButtons {...rest} />
    </>
  );
};

export default TopEarners;
