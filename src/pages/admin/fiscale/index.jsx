import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import usePagination from "src/components/pagination/usePagination";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";

const PAYOUT_HEADERS = [
  "Promoter",
  "Data Richiesta",
  "Importo Lordo",
  "Netto Stimato",
  "Metodo Pagamento",
  "Azioni",
];

const PAYMENT_METHODS = {
  1: "Crypto",
  2: "Bonifico",
  3: "Stripe",
};

// ---------- Fiscal helpers ----------
const calcFiscale = (amount) => {
  const lordo = parseFloat(amount) || 0;
  if (lordo <= 0) return null;
  const imponibile = lordo * 0.78;
  const ritenuta = imponibile * 0.23;
  const inps = imponibile * 0.0919 * 0.333;
  const bollo = lordo >= 100 ? 2 : 0;
  const netto = lordo - ritenuta - inps - bollo;
  return { lordo, imponibile, ritenuta, inps, bollo, netto };
};

const calcNettoQuick = (amount) => {
  const lordo = parseFloat(amount) || 0;
  const imponibile = lordo * 0.78;
  const ritenuta = imponibile * 0.23;
  const inps = imponibile * 0.0919 * 0.333;
  const bollo = lordo >= 100 ? 2 : 0;
  return lordo - ritenuta - inps - bollo;
};

// ---------- Components ----------
const StatCard = ({ label, value }) => (
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
      {label}
    </Typography>
    <Typography
      variant="h5"
      sx={{ color: "#B8963B", fontWeight: 700, mt: 0.5 }}
    >
      {value}
    </Typography>
  </Box>
);

const FiscaleBreakdown = ({ calc }) => {
  if (!calc) return null;

  const rows = [
    { label: "Importo lordo", value: calc.lordo },
    { label: "Imponibile (78%)", value: calc.imponibile },
    { label: "Ritenuta d'acconto (23%)", value: -calc.ritenuta, deduction: true },
    { label: "INPS quota promoter", value: -calc.inps, deduction: true },
    { label: "Bollo", value: -calc.bollo, deduction: true },
    { label: "Netto stimato", value: calc.netto, highlight: true },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#FAF6EF",
        border: "1px solid #E8DDCA",
        borderRadius: 2,
        p: 2,
      }}
    >
      {rows.map(({ label, value, deduction, highlight }) => (
        <Box
          key={label}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 0.5,
            ...(highlight && {
              borderTop: "1px solid #E8DDCA",
              mt: 0.5,
              pt: 1,
            }),
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: highlight ? 700 : 400,
              color: highlight ? "#B8963B" : "text.primary",
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: highlight ? 700 : 400,
              color: deduction
                ? "#C0392B"
                : highlight
                ? "#B8963B"
                : "text.primary",
            }}
          >
            {deduction ? "−" : ""}€{Math.abs(value).toFixed(2)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const ApproveDialog = ({ open, onClose, request, onConfirm, loading }) => {
  const calc = useMemo(
    () => (request ? calcFiscale(request.amount) : null),
    [request]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Conferma Approvazione Payout</DialogTitle>
      <DialogContent>
        {request && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Promoter: <strong>{request.user?.username}</strong>
            </Typography>
            <FiscaleBreakdown calc={calc} />
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 2, color: "text.secondary" }}
            >
              Confermando, il payout verrà approvato e le ritenute calcolate
              verranno applicate.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annulla
        </Button>
        <LoadingButton
          variant="contained"
          loading={loading}
          onClick={onConfirm}
          sx={{
            backgroundColor: "#B8963B",
            "&:hover": { backgroundColor: "#967A2F" },
          }}
        >
          Approva
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

// ---------- Main ----------
const GestionePrelievi = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { count, onChange, page, seed, rowStart } = usePagination();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [approveTarget, setApproveTarget] = useState(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(null);

  // Fetch all pending payout requests
  const fetchPending = useCallback(
    async (p = 1) => {
      setLoading(true);
      setError(false);
      try {
        const { data: res } = await axiosInstance.get(
          "api/admin/payout-requests",
          { params: { page: p } }
        );
        const pending = res?.data?.pending_payout;
        const list = pending?.data || [];
        setData(Array.isArray(list) ? list : []);
        if (pending?.last_page != null) {
          seed(pending.last_page, pending.from);
        }
      } catch (err) {
        console.error(err);
        setError(true);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [seed]
  );

  useEffect(() => {
    fetchPending(page);
  }, [page]);

  // Stats
  const stats = useMemo(() => {
    const totalAmount = data.reduce(
      (s, r) => s + (parseFloat(r.amount) || 0),
      0
    );
    return { count: data.length, totalAmount };
  }, [data]);

  // Approve
  const handleApprove = useCallback(async () => {
    if (!approveTarget) return;
    setApproving(true);
    try {
      const { status, data: res } = await axiosInstance.post(
        `api/admin/approve-payout/${approveTarget.id}`
      );
      if (status === 200) {
        enqueueSnackbar(res.message || "Payout approvato");
        setApproveTarget(null);
        fetchPending(page);
      }
    } catch (err) {
      enqueueSnackbar("Errore nell'approvazione", { variant: "error" });
    } finally {
      setApproving(false);
    }
  }, [approveTarget, fetchPending, page, enqueueSnackbar]);

  // Reject
  const handleReject = useCallback(
    async (id) => {
      setRejecting(id);
      try {
        const { status, data: res } = await axiosInstance.post(
          `api/admin/reject-payout/${id}`
        );
        if (status === 200) {
          enqueueSnackbar(res.message || "Payout rifiutato");
          fetchPending(page);
        }
      } catch (err) {
        enqueueSnackbar("Errore nel rifiuto", { variant: "error" });
      } finally {
        setRejecting(null);
      }
    },
    [fetchPending, page, enqueueSnackbar]
  );

  const dataProps = {
    loading,
    error,
    isArrayEmpty: data.length === 0,
  };

  return (
    <div>
      <Page title="Gestione Prelievi">
        <HeaderBreadcrumbs
          heading="Gestione Prelievi"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "Gestione Prelievi" },
          ]}
        />

        {/* Summary */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <StatCard
              label="Richieste Pendenti"
              value={stats.count}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StatCard
              label="Totale Importo Pendente"
              value={`€${stats.totalAmount.toFixed(2)}`}
            />
          </Grid>
        </Grid>

        {/* Pending requests table */}
        <Card sx={{ pt: 1 }}>
          <Scrollbar>
            <DataHandlerTable
              name="gestione-prelievi-table"
              headers={PAYOUT_HEADERS}
              dataProps={dataProps}
            >
              <Map
                list={data}
                render={(row, i) => (
                  <TableRow
                    key={row.id || i}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>{row.user?.username}</TableCell>
                    <TableCell>
                      <ParseDate date={row.created_at} />
                    </TableCell>
                    <TableCell>
                      €{parseFloat(row.amount || 0).toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{ color: "#B8963B", fontWeight: 700 }}
                    >
                      €{calcNettoQuick(row.amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {PAYMENT_METHODS[row.payment_type] || row.payment_type}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setApproveTarget(row)}
                          sx={{
                            color: "#4A5C3A",
                            borderColor: "#4A5C3A",
                            "&:hover": {
                              borderColor: "#3A4A2E",
                              backgroundColor: "rgba(74, 92, 58, 0.04)",
                            },
                          }}
                        >
                          Approva
                        </Button>
                        <LoadingButton
                          size="small"
                          variant="outlined"
                          color="error"
                          loading={rejecting === row.id}
                          onClick={() => handleReject(row.id)}
                        >
                          Rifiuta
                        </LoadingButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              />
            </DataHandlerTable>
          </Scrollbar>
        </Card>

        <PaginationButtons count={count} onChange={onChange} page={page} />

        {/* Approve confirmation dialog */}
        <ApproveDialog
          open={Boolean(approveTarget)}
          onClose={() => setApproveTarget(null)}
          request={approveTarget}
          onConfirm={handleApprove}
          loading={approving}
        />
      </Page>
    </div>
  );
};

export default GestionePrelievi;
