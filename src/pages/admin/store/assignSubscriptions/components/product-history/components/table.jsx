import { IconButton, TableCell, TableRow } from "@mui/material";

import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";

const headers = [
  "assign_subscriptions.no",
  "assign_subscriptions.userName",
  "assign_subscriptions.product",
  "assign_subscriptions.categoryy",
  "assign_subscriptions.note",
  "assign_subscriptions.certifiedDate",
  "assign_subscriptions.effectiveUntil",
  "assign_subscriptions.assigned_on",
  "assign_subscriptions.action",
];

const ProductHistoryTable = ({ dataList, handleOpenMenu, rowStart }) => {
  const { data, ...dataProps } = dataList;
  return (
    <Scrollbar>
      <DataHandlerTable
        name="faq-table"
        headers={headers}
        dataProps={dataProps}
      >
        <Map
          list={data}
          render={(item, i) => (
            <TableRow key={item.id}>
              <TableCell>{i + rowStart}</TableCell>
              <TableCell>{item.user_purchase.user.username}</TableCell>
              <TableCell>{item.product.name}</TableCell>
              <TableCell>
                {item.user_purchase.product_subscription_category?.name}
              </TableCell>
              <TableCell>{item.user_purchase.note}</TableCell>
              <TableCell>
                <ParseDate date={item.user_purchase.date} />
              </TableCell>
              <TableCell>
                <ParseDate date={item.effective_until} />
              </TableCell>
              <TableCell>
                <ParseDate date={item.created_at} />
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={handleOpenMenu(
                    item.id,
                    item.user_purchase.user_id,
                    !item.user_purchase?.user?.active
                  )}
                  name="more-button"
                >
                  <Iconify
                    icon={"eva:more-vertical-fill"}
                    width={20}
                    height={20}
                  />
                </IconButton>
              </TableCell>
            </TableRow>
          )}
        />
      </DataHandlerTable>
    </Scrollbar>
  );
};

export default ProductHistoryTable;
