import {
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EmptyTable from "src/components/emptyTable";
import PaginationButtons from "src/components/pagination";

import Scrollbar from "src/components/Scrollbar";
import { BodyRow } from "src/components/custom-table";

import Translate from "src/components/translate";
import useReferrals from "src/pages/user/profile/sub-pages/referrals/hooks/useReferrals";

const Referrals = () => {
  const { count, data, onChange, page, rowStart } = useReferrals();

  const isEmpty = !Boolean(data?.length);

  return (
    <div>
      <Card>
        <CardHeader
          title={
            <Typography variant="subtitle2">
              <Translate>{"affiliate_dashboard.referrals"}</Translate>
            </Typography>
          }
          sx={{ mb: 1 }}
        />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Translate>{"affiliate_dashboard.no"}</Translate>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Translate>{"affiliate_dashboard.user_name"} </Translate>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Translate>{"affiliate_dashboard.email"}</Translate>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Translate>{"affiliate_dashboard.active"}</Translate>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Translate>
                      {"affiliate_dashboard.active_products"}
                    </Translate>
                  </TableCell>
                </TableRow>
              </TableHead>
              {isEmpty ? (
                <BodyRow>
                  <TableCell colSpan={4.5} align="center">
                    <EmptyTable title="No Data Available" />
                  </TableCell>
                </BodyRow>
              ) : (
                <TableBody>
                  {data.map((row, i) => (
                    <TableRow key={row.id}>
                      <TableCell>{rowStart + i}</TableCell>

                      <TableCell>{row.username}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        {Boolean(row.active) ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>{row.rank_id > 1 ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>
        <PaginationButtons onChange={onChange} count={count} page={page} />
      </Card>
    </div>
  );
};

export default Referrals;
