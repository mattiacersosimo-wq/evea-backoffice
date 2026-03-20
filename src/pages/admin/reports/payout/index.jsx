import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import useReport from "../hooks/use-report";
import ReportFilter from "../report-filter";
import DataList from "./data-list";

const headers = [
  "settings.reports.no",
  "settings.reports.username",
  "settings.reports.fullName",
  "settings.reports.status",
  "settings.reports.walletAddress",
  "settings.reports.requestedAmount",
  "settings.reports.adminFeeDeducted",
  "settings.reports.amountReleased",
  "settings.reports.coin",
  "settings.reports.date",
];

const Payout = ({ title, heading }) => {
  const { getReport, state, rowStart, sum, ...rest } = useReport("payout", {
    title,
    heading,
  });
  const { data, ...dataProps } = state;

  return (
    <>
      <ReportFilter getReport={getReport} sum={sum} />
      <DataHandlerTable sx={{pt:1}}
        name="payout-table"
        headers={headers}
        dataProps={{ ...dataProps }}
      >
        <Map
          list={data}
          render={(payout, i) => (
            <DataList payout={payout} rowNumber={rowStart + i} />
          )}
        />
      </DataHandlerTable>
      <PaginationButtons {...rest} />
    </>
  );
};

export default Payout;
