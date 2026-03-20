import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import useReport from "../hooks/use-report";
import ReportFilter from "../report-filter";
import DataList from "./data-list";

const headers = [
  "settings.reports.no",
  "settings.reports.username",
  "settings.reports.leg",
  "settings.reports.pv",
  "settings.reports.date",
];

const PointHistory = ({ title, heading, isPoint = true }) => {
  const { getReport, state, rowStart, sum, ...rest } = useReport("point", {
    title,
    heading,
  });
  const { data, ...dataProps } = state;

  return (
    <>
      <ReportFilter isPoint={isPoint} getReport={getReport} sum={sum} />
      <DataHandlerTable
        sx={{ pt: 1 }}
        name="point-table"
        headers={headers}
        dataProps={{ ...dataProps }}
      >
        <Map
          list={data}
          render={(point, i) => (
            <DataList point={point} rowNumber={rowStart + i} />
          )}
        />
      </DataHandlerTable>
      <PaginationButtons {...rest} />
    </>
  );
};

export default PointHistory;
