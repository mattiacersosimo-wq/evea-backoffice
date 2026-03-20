import { Card } from "@mui/material";
import PaginationButtons from "src/components/pagination";
import PayNow from "src/pages/user/businessBuilder/subscriptions/components/payNow/index.jsx";
import HistoryTable from "./historyTable";
import useFetchHistoryTable from "./hooks/useFetchHistoryTable";

const History = () => {
  const { state, rowStart, ...rest } = useFetchHistoryTable();

  return (
    <>
      <Card>
        <PayNow />
        <HistoryTable history={state} rowStart={rowStart} />
      </Card>
      <PaginationButtons {...rest} />
    </>
  );
};

export default History;
