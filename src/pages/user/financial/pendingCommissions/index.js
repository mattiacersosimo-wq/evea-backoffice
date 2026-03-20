import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useMemo, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import { PATH_USER } from "src/routes/paths";
import useReferrals from "./hooks/useCouponPurchase";
import DataFilter from "./filter";

var headers = [
  "global.username",
  "financial.e_wallet.table.from",
  "search.amount_type",
  "global.payment_type",
  "global.amount",
  "global.Dates",
];

var StatCard = function (props) {
  return (
    <Box
      sx={{
        p: "16px",
        backgroundColor: "#FAF6EF",
        border: "1px solid #E8DDCA",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          color: "#7A6A5C",
          fontSize: "12px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {props.label}
      </Typography>
      <Typography
        variant="h5"
        sx={{ color: "#B8963B", fontWeight: 700, mt: 0.5 }}
      >
        {props.value}
      </Typography>
    </Box>
  );
};

var buildFilter = function (month, year, paymentType) {
  return {
    start_date: moment({ year: year, month: month - 1 }).startOf("month"),
    end_date: moment({ year: year, month: month - 1 }).endOf("month"),
    payment_type: paymentType || "all",
  };
};

var exportCSV = function (data) {
  if (!data || data.length === 0) return;
  var csvHeaders = ["Username", "Da", "Tipo", "Tipo Pagamento", "Importo", "Data"];
  var rows = data.map(function (row) {
    return [
      row.user ? row.user.username || "" : "",
      row.from_user ? row.from_user.username || "" : "",
      row.type || "",
      row.payment_type || "",
      row.total_amount || "",
      row.created_at || "",
    ];
  });
  var csv = [csvHeaders].concat(rows).map(function (r) { return r.join(","); }).join("\n");
  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  var url = URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = url;
  link.download = "commissioni_pending.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

var exportPDF = function (data, totale) {
  if (!data || data.length === 0) return;
  var printWindow = window.open("", "_blank");
  var rows = data.map(function (row) {
    return "<tr>" +
      "<td>" + (row.user ? row.user.username || "" : "") + "</td>" +
      "<td>" + (row.from_user ? row.from_user.username || "" : "") + "</td>" +
      "<td>" + (row.type || "") + "</td>" +
      "<td>" + (row.payment_type || "") + "</td>" +
      "<td>" + (row.total_amount || "") + "</td>" +
      "<td>" + (row.created_at || "") + "</td>" +
      "</tr>";
  }).join("");
  printWindow.document.write(
    "<html><head><title>Commissioni Pending</title>" +
    "<style>" +
    "body { font-family: Arial, sans-serif; padding: 20px; }" +
    "table { width: 100%; border-collapse: collapse; margin-top: 20px; }" +
    "th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }" +
    "th { background-color: #FAF6EF; color: #7A6A5C; }" +
    ".total-row { font-weight: bold; background-color: #FAF6EF; }" +
    "</style></head><body>" +
    "<h2>Commissioni Pending</h2>" +
    "<table><thead><tr>" +
    "<th>Username</th><th>Da</th><th>Tipo</th><th>Tipo Pagamento</th><th>Importo</th><th>Data</th>" +
    "</tr></thead><tbody>" +
    rows +
    '<tr class="total-row"><td colspan="4">Totale</td><td>' + totale + '</td><td></td></tr>' +
    "</tbody></table></body></html>"
  );
  printWindow.document.close();
  printWindow.print();
};

var PendingCommissions = function () {
  var now = new Date();
  var initMonth = now.getMonth() + 1;
  var initYear = now.getFullYear();

  var _month = useState(initMonth);
  var month = _month[0];
  var setMonth = _month[1];

  var _year = useState(initYear);
  var year = _year[0];
  var setYear = _year[1];

  var _paymentType = useState("all");
  var paymentType = _paymentType[0];
  var setPaymentType = _paymentType[1];

  var _applied = useState(buildFilter(initMonth, initYear, "all"));
  var appliedFilter = _applied[0];
  var setAppliedFilter = _applied[1];

  var hookResult = useReferrals(appliedFilter);
  var state = hookResult.state;
  var fetchData = hookResult.fetchData;
  var count = hookResult.count;
  var onChange = hookResult.onChange;
  var page = hookResult.page;
  var rowStart = hookResult.rowStart;

  var data = state.data;
  var loading = state.loading;
  var error = state.error;
  var isArrayEmpty = state.isArrayEmpty;

  var handleApply = function () {
    var newFilter = buildFilter(month, year, paymentType);
    setAppliedFilter(newFilter);
  };

  var stats = useMemo(function () {
    if (!data || data.length === 0) return { totale: 0, count: 0 };
    var totale = 0;
    for (var i = 0; i < data.length; i++) {
      totale += parseFloat(data[i].total_amount) || 0;
    }
    return { totale: totale, count: data.length };
  }, [data]);

  return (
    <div>
      <Page title="global.pendingcommissions">
        <HeaderBreadcrumbs
          heading="global.pendingcommissions"
          links={[
            { name: "global.dashboard", href: PATH_USER.root },
            { name: "global.pendingcommissions" },
          ]}
        />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <StatCard
              label="Totale Commissioni"
              value={"\u20AC" + stats.totale.toFixed(2)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StatCard label="Numero Transazioni" value={stats.count} />
          </Grid>
        </Grid>

        <Card sx={{ pt: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <DataFilter
              month={month}
              year={year}
              paymentType={paymentType}
              onMonthChange={setMonth}
              onYearChange={setYear}
              onPaymentTypeChange={setPaymentType}
              onApply={handleApply}
            />
            <Stack direction="row" spacing={1} sx={{ p: 2 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={function () { exportCSV(data); }}
                sx={{
                  color: "#B8963B",
                  borderColor: "#B8963B",
                  "&:hover": {
                    borderColor: "#967A2F",
                    backgroundColor: "rgba(184, 150, 59, 0.04)",
                  },
                }}
              >
                CSV
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={function () { exportPDF(data, "\u20AC" + stats.totale.toFixed(2)); }}
                sx={{
                  color: "#B8963B",
                  borderColor: "#B8963B",
                  "&:hover": {
                    borderColor: "#967A2F",
                    backgroundColor: "rgba(184, 150, 59, 0.04)",
                  },
                }}
              >
                PDF
              </Button>
            </Stack>
          </Box>

          <Scrollbar>
            <DataHandlerTable
              name="pending-commissions-table"
              headers={headers}
              dataProps={{ loading: loading, error: error, isArrayEmpty: isArrayEmpty }}
            >
              <Map
                list={data}
                render={function (row, i) {
                  return (
                    <TableRow
                      key={row.id || i}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>{row.user ? row.user.username : ""}</TableCell>
                      <TableCell>{row.from_user ? row.from_user.username : ""}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>
                        {row.payment_type === "Go Mvp Bonus"
                          ? "Go MVP Bonus"
                          : row.payment_type === "Rock Solid Mvp Bonus"
                          ? "Rock Solid MVP Bonus"
                          : row.payment_type === "Rock Solid Mvp Additional Bonus"
                          ? "Rock Solid MVP Additional Bonus"
                          : row.payment_type === "Pmb Bonus"
                          ? "MVP Mentor Bonus"
                          : row.payment_type}
                      </TableCell>
                      <TableCell>{row.total_amount}</TableCell>
                      <TableCell>
                        <ParseDate date={row.created_at} />
                      </TableCell>
                    </TableRow>
                  );
                }}
              />
              {data && data.length > 0 && (
                <TableRow
                  sx={{
                    backgroundColor: "#FAF6EF",
                    "& td": { fontWeight: 700 },
                  }}
                >
                  <TableCell
                    colSpan={4}
                    sx={{ color: "#7A6A5C", fontWeight: 700 }}
                  >
                    Totale
                  </TableCell>
                  <TableCell sx={{ color: "#B8963B", fontWeight: 700 }}>
                    {"\u20AC"}{stats.totale.toFixed(2)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              )}
            </DataHandlerTable>
          </Scrollbar>
        </Card>
        <PaginationButtons onChange={onChange} page={page} count={count} />
      </Page>
    </div>
  );
};

export default PendingCommissions;
