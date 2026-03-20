import { Box, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { fCurrency } from "src/utils/formatNumber";

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  "& td": {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const InvoiceBody = ({ invoice }) => {
  const { amount, period_month, business_builder, user } = invoice || {};
  return (
    <TableBody>
      <TableRow
        sx={{
          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <TableCell>{1}</TableCell>
        <TableCell>
          <Box sx={{ maxWidth: 560 }}>
            <Typography variant="subtitle2">
              {business_builder?.name}
            </Typography>
            {/* <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
              {business_builder?.name}
            </Typography> */}
          </Box>
        </TableCell>
        <TableCell>{user?.username}</TableCell>
        <TableCell>{period_month}</TableCell>
        <TableCell>{fCurrency(amount)}</TableCell>
      </TableRow>
      {/* <RowResultStyle>
        <TableCell colSpan={3} />
        <TableCell align="right">
          <Box sx={{ mt: 2 }} />
          <Typography>Subtotal</Typography>
        </TableCell>
        <TableCell align="right" width={120}>
          <Box sx={{ mt: 2 }} />
          <Typography>{fCurrency(subTotalPrice)}</Typography>
        </TableCell>
      </RowResultStyle> */}
      {/* 
      <RowResultStyle>
        <TableCell colSpan={3} />
        <TableCell align="right">
          <Typography>Discount</Typography>
        </TableCell>
        <TableCell align="right" width={120}>
          <Typography sx={{ color: "error.main" }}>
            {discount && fCurrency(-discount)}
          </Typography>
        </TableCell>
      </RowResultStyle> */}

      {/* <RowResultStyle>
        <TableCell colSpan={3} />
        <TableCell align="right">
          <Typography>Period</Typography>
        </TableCell>
        <TableCell align="right" width={120}>
          <Typography>{period_month}</Typography>
        </TableCell>
      </RowResultStyle>
 */}
      <RowResultStyle>
        <TableCell colSpan={3} />
        <TableCell align="right">
          <Typography variant="h6">Total</Typography>
        </TableCell>
        <TableCell align="right" width={140}>
          <Typography variant="h6">{fCurrency(amount)}</Typography>
        </TableCell>
      </RowResultStyle>
    </TableBody>
  );
};

export default InvoiceBody;
