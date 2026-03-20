import { Card, TableCell, TableRow } from "@mui/material";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import useTrashed from "./hooks/use-trashed";

const headers = [
  "assign_subscriptions.no",
  "assign_subscriptions.userName",
  "assign_subscriptions.product",
  "assign_subscriptions.categories",
  "assign_subscriptions.note",
  "assign_subscriptions.certifiedDate",
  "assign_subscriptions.effectiveUntil",
  "assign_subscriptions.createdDate",
];

const Trashed = () => {
  const { state, rowStart, ...rest } = useTrashed();
  const { data, ...dataProps } = state;
  return (
    <>
      <Page title="Trashed: Store">
        <Card sx={{ p: 2 }}>
          <Scrollbar>
            <DataHandlerTable
              name="faq-table"
              headers={headers}
              dataProps={{ ...dataProps }}
            >
              <Map
                list={data}
                render={(item, i) => {
                  const {
                    user_purchase,
                    product,
                    effective_until,
                    created_at,
                  } = item;

                  return (
                    <TableRow key={i}>
                      <TableCell>{i + rowStart}</TableCell>
                      <TableCell>{user_purchase?.user?.username}</TableCell>
                      <TableCell>{product?.name}</TableCell>
                      <TableCell>
                        {user_purchase?.product_subscription_category?.name}
                      </TableCell>
                      <TableCell>{user_purchase?.note}</TableCell>
                      <TableCell>
                        <ParseDate date={user_purchase?.date} />
                      </TableCell>
                      <TableCell>
                        <ParseDate date={effective_until} />
                      </TableCell>
                      <TableCell>
                        <ParseDate date={created_at} />
                      </TableCell>
                    </TableRow>
                  );
                }}
              />
            </DataHandlerTable>
          </Scrollbar>
        </Card>
      </Page>
      <PaginationButtons {...rest} />
    </>
  );
};

export default Trashed;
