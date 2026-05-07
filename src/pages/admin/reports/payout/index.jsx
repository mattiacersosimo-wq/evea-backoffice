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

const PAYOUT_EXTRA_FILTERS = [
  {
    name: "status",
    label: "Stato",
    options: [
      { value: "pending", label: "In attesa" },
      { value: "approved", label: "Approvato" },
      { value: "rejected", label: "Rifiutato" },
      { value: "completed", label: "Completato" },
      { value: "failed", label: "Fallito" },
    ],
  },
  {
    name: "coin_id",
    label: "Coin",
    options: [
      { value: "1", label: "Litecoin (LTC)" },
      { value: "2", label: "Ethereum (ETH)" },
      { value: "3", label: "Bitcoin (BTC)" },
      { value: "4", label: "Bitcoin Cash (BCH)" },
    ],
  },
];

const Payout = ({ title, heading }) => {
  const { getReport, state, rowStart, sum, ...rest } = useReport("payout", {
    title,
    heading,
  });
  const { data, ...dataProps } = state;

  return (
    <>
      <ReportFilter getReport={getReport} sum={sum} extraFilters={PAYOUT_EXTRA_FILTERS} />
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
