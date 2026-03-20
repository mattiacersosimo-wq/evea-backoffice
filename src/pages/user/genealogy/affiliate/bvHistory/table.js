// @mui
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

// _mock_
// components
import Scrollbar from "src/components/Scrollbar";
import EmptyTable from "src/components/emptyTable";

// ----------------------------------------------------------------------
import { BodyRow } from "src/components/custom-table";
import Translate from "src/components/translate";

const _ecommerceBestSalesman = [...Array(5)].map((_, index) => ({
  id: " 1",
  name: " _mock.name.fullName(index)",
  email: " _mock.email(index)",
  avatar: " _mock.image.avatar(index + 8)",
  category: " CATEGORY[index]",
  flag: " `https://minimal-assets-api.vercel.app/assets/icons/ic_flag_${COUNTRY[index]}.svg`",
  total: " _mock.number.price(index)",
  rank: " `Top ${index + 1}`",
}));

export default function BvHistory() {
  const isEmpty = !Boolean(_ecommerceBestSalesman?.length);
  return (
    <Card sx={{ height: 190 }}>
      <CardHeader
        title={
          <Typography variant="subtitle2">
            <Translate>{"affiliate_dashboard.weekly"}</Translate>
          </Typography>
        }
        sx={{ mb: 1 }}
      />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={50}>
                  <Translate>{"affiliate_dashboard.total"}</Translate>
                </TableCell>
                <TableCell width={50}>
                  <Translate>{"affiliate_dashboard.aquired"}</Translate>
                </TableCell>
                <TableCell width={50}>
                  <Translate> {"affiliate_dashboard.required"}</Translate>
                </TableCell>
              </TableRow>
            </TableHead>
            {isEmpty ? (
              <BodyRow>
                <TableCell colSpan={7} align="center">
                  <EmptyTable title="No Data Available" />
                </TableCell>
              </BodyRow>
            ) : (
              <TableBody>
                {_ecommerceBestSalesman.slice(1, 2).map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>200</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}
