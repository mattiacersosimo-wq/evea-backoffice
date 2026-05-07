import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import useReport from "../hooks/use-report";
import ReportFilter from "../report-filter";
import DataList from "./data-list";

const headers = [
  "settings.reports.no",
  "settings.reports.username",
  "settings.reports.bonusType",
  "settings.reports.credit",
  "settings.reports.date",
];

const INCOME_EXTRA_FILTERS = [
  {
    name: "bonus_type",
    label: "Tipo bonus",
    allLabel: "Tutti",
    allValue: "all",
    options: [
      { value: "direct_sales_bonus", label: "Direct Sales" },
      { value: "indirect_sales_bonus", label: "Indirect Sales" },
      { value: "residual_bonus", label: "Residual" },
      { value: "residual_matching", label: "Residual Matching" },
      { value: "leadership_bonus", label: "Leadership" },
      { value: "eveolving_bonus", label: "Evolving" },
      { value: "ritual_bonus", label: "Ritual" },
      { value: "fast_start_bonus", label: "Fast Start" },
      { value: "go_mvp_bonus", label: "Go MVP" },
      { value: "rock_solid_mvp_bonus", label: "Rock Solid MVP" },
      { value: "pmb_bonus", label: "PMB" },
    ],
  },
];

const Income = ({ title, heading }) => {
  const { getReport, state, rowStart, sum, ...rest } = useReport("income", {
    title,
    heading,
  }, ["bonus_type"]);
  const { data, ...dataProps } = state;

  return (
    <>
      <ReportFilter getReport={getReport} sum={sum} extraFilters={INCOME_EXTRA_FILTERS} />
      <DataHandlerTable sx={{pt:1}}
        name="income-table"
        headers={headers}
        dataProps={dataProps}
      >
        <Map
          list={data}
          render={(income, i) => (
            <DataList income={income} rowNumber={rowStart + i} />
          )}
        />
      </DataHandlerTable>
      <PaginationButtons {...rest} />
    </>
  );
};

export default Income;
