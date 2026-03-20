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
  "user_nav.genealogy.sponsor",
  "settings.reports.dateJoined",
];

const Joining = ({ title, heading, isJoining = true }) => {
  const { getReport, state, rowStart, ...rest } = useReport("joining", {
    title,
    heading,
  });
  const { data, ...dataProps } = state;

  return (
    <>
      <ReportFilter getReport={getReport} isJoining={isJoining} />
      <DataHandlerTable headers={headers} dataProps={dataProps} sx={{ pt: 1 }}>
        <Map
          list={data}
          render={(joining, i) => (
            <DataList joining={joining} rowNumber={rowStart + i} />
          )}
        />
      </DataHandlerTable>
      <PaginationButtons {...rest} />
    </>
  );
};

export default Joining;
