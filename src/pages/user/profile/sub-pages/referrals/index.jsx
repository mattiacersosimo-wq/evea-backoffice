import { Card, TableCell, TableRow, Typography } from "@mui/material";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";

import Translate from "src/components/translate";
import useReferrals from "./hooks/useReferrals";

const headers = [
  "profile.referral.table.no",
  "profile.referral.table.user",
  "profile.referral.table.email",
  "profile.referral.table.active",
  "profile.referral.table.date",
];

const ProfileReferrals = () => {
  const { state, count, onChange, page, rowStart } = useReferrals();
  const { data, ...dataProps } = state;

  return (
    <div>
      <Card sx={{ p: 3 }}>
        <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
          <Translate>profile.referral.title</Translate>
        </Typography>
        <Scrollbar>
          <DataHandlerTable
            name="category-table"
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(item, i) => (
                <TableRow>
                  <TableCell>{rowStart + i}</TableCell>
                  <TableCell>{item?.username} </TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    {Boolean(item.paid_active) ? "Yes" : "No"}
                  </TableCell>
                  {/* <TableCell>{item.rank_id > 1 ? "Yes" : "No"}</TableCell> */}
                  <TableCell>
                    <ParseDate date={item.created_at} />
                  </TableCell>
                </TableRow>
              )}
            />
          </DataHandlerTable>
        </Scrollbar>
        <PaginationButtons onChange={onChange} count={count} page={page} />
      </Card>
    </div>
  );
};

export default ProfileReferrals;
