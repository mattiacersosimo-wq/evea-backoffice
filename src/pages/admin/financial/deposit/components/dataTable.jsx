import {
  Box,
  Card,
  Divider,
  Grid,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { capitalCase } from "change-case";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import { Currency } from "src/components/with-prefix";
import DataFilter from "../../shared/components/filter";
import useFilter from "../../shared/hooks/use-filter";
import useFetchDepositWallet from "../hooks/useFetchDepositWallet";
import useWidgetData from "../hooks/useWidgetData";
import Cards from "./cards";

const headers = [
  "financial.deposit_wallet.table.no",
  "financial.deposit_wallet.table.user",
  "financial.deposit_wallet.table.from",
  "financial.deposit_wallet.table.amount",
  "financial.deposit_wallet.table.payment_type",
  "financial.deposit_wallet.table.amount_type",
  "financial.deposit_wallet.table.date",
];

const DataTable = () => {
  const { balance, credits, expense } = useWidgetData();
  const methods = useFilter();
  const filter = methods.watch();
  const { state, fetchData, rowStart, ...rest } = useFetchDepositWallet(filter);
  const { data, ...dataProps } = state;
  const onFilter = methods.handleSubmit(
    async (inputData) => await fetchData(1, inputData)
  );
  return (
    <>
      <div>
        <Card>
          <Grid container spacing={3} p={1.2}>
            <Cards
              total={balance}
              title="global.balance"
              icon={"arcticons:priceconverter"}
              color="#09b804"
            />
            <Cards
              total={expense}
              title="global.expense"
              icon={"arcticons:priceconverter"}
              color="#348efe"
            />
            <Cards
              total={credits}
              title="global.total_credits"
              icon={"arcticons:priceconverter"}
              color="#ff4842"
            />
          </Grid>
          <DataFilter
            methods={methods}
            onFilter={onFilter}
            isWallet="deposit"
          />
          <Scrollbar>
            <DataHandlerTable
              name="faq-table"
              headers={headers}
              dataProps={{ ...dataProps }}
            >
              <Map
                list={data}
                render={(item, i) => (
                  <>
                    <TableRow key={item.id}>
                      <TableCell>{i + rowStart}</TableCell>
                      <TableCell>{item.user.username}</TableCell>
                      <TableCell>{item.fromuser.username}</TableCell>
                      <TableCell>
                        <Currency>{item.total_amount}</Currency>
                      </TableCell>
                      <TableCell>{capitalCase(item.type)}</TableCell>
                      <TableCell>{item.payment_type}</TableCell>
                      <TableCell>
                        <ParseDate date={item.created_at} />
                      </TableCell>
                    </TableRow>
                  </>
                )}
              />
            </DataHandlerTable>
          </Scrollbar>
          <Divider />
        </Card>
      </div>

      <PaginationButtons {...rest} />
    </>
  );
};

export default DataTable;
