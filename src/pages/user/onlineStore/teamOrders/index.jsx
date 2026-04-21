import {
  Box,
  Card,
  Chip,
  Dialog,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";
import { Currency } from "src/components/with-prefix";

import Ternary from "src/components/ternary";
import Transition from "src/utils/dialog-animation";
import useMyOrders from "./hooks/useMyOrders";
import DataFilter from "./components/filter";
import useFilter from "../pending-payments/components/hooks/use-filter";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";

const getStatusBadge = (row) => {
  const os = (row?.order_status || "").toLowerCase();
  if (os === "refunded" || os === "cancelled") return { label: "Rimborsato", bgcolor: "#FCEBEB", color: "#A32D2D" };
  if (os === "partially_refunded") return { label: "Parzialmente rimborsato", bgcolor: "#FFF3E0", color: "#E65100" };
  if (os === "finished" || os === "paid" || os === "complete") return { label: "Completato", bgcolor: "#EAF3DE", color: "#27500A" };
  if (os === "processing") return { label: "In lavorazione", bgcolor: "#FFF8E1", color: "#7A6A5C" };
  return { label: "In attesa", bgcolor: "#E8DDCA", color: "#5C4A3A" };
};

const TeamOrders = () => {
  const methods = useFilter();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isIt = i18n.language?.startsWith("it");
  const L = {
    title: isIt ? "Ordini Team" : "Team Orders",
    subtitle: isIt ? "Acquisti della tua downline" : "Your downline purchases",
    no: "#",
    user: isIt ? "Utente" : "User",
    product: isIt ? "Prodotto" : "Product",
    bv: "BV",
    qv: "QV",
    ev: "EV",
    payment: isIt ? "Pagamento" : "Payment",
    date: isIt ? "Data" : "Date",
    total: isIt ? "Totale" : "Total",
    status: isIt ? "Stato" : "Status",
  };
  const headers = [L.no, L.user, L.product, L.bv, L.qv, L.ev, L.payment, L.date, L.total, L.status];

  const [openMenu, setOpenMenuActions] = useState(null);
  const handleCloseMenu = () => setOpenMenuActions(null);

  const [openCombo, setOpenCombo] = useState(false);
  const { state, fetchData, rowStart, ...rest } = useMyOrders();
  const { data, ...dataProps } = state;

  const onFilter = methods.handleSubmit(async (inputData) => {
    await fetchData(1, inputData);
  });

  return (
    <Page title={L.title}>
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4 }}>
        <Card sx={{
          background: `linear-gradient(135deg, #FAF6EF 0%, #F5EEDE 60%, #F0E7CF 100%)`,
          color: ESPRESSO, borderRadius: 3, p: { xs: 2.5, md: 3 }, mb: 3,
          position: "relative", overflow: "hidden",
          border: `1px solid ${alpha(ORO, 0.25)}`,
          boxShadow: `0 2px 16px ${alpha(ORO, 0.08)}`,
        }}>
          <Box sx={{ position: "absolute", bottom: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(ORO, 0.12)} 0%, transparent 70%)` }} />
          <Stack direction="row" alignItems="center" spacing={2} sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(ORO, 0.2)} 0%, ${alpha(ORO, 0.08)} 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 2px 8px ${alpha(ORO, 0.2)}`,
            }}>
              <Iconify icon="mdi:account-group-outline" width={28} sx={{ color: ORO }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color={ESPRESSO}>{L.title}</Typography>
              <Typography sx={{ fontSize: "0.82rem", color: MUTED }}>{L.subtitle}</Typography>
            </Box>
          </Stack>
        </Card>

        <Card sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid #f0ece6", boxShadow: "0 1px 3px rgba(44, 26, 14, 0.04)" }}>
          <DataFilter methods={methods} onFilter={onFilter} isWallet="ewallet" />
          <Scrollbar>
            <DataHandlerTable name="team-orders-table" headers={headers} dataProps={{ ...dataProps }}>
              <Map
                list={data}
                render={(row, i) => (
                  <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 }, transition: "background-color .15s ease", "&:hover": { bgcolor: alpha(ORO, 0.03) } }}>
                    <TableCell component="th" scope="row">{i + rowStart}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: ESPRESSO }}>{row.user?.username}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Ternary
                          when={row?.purchase_type === "coupon_purchase"}
                          then={isIt ? "Acquisto Coupon" : "Coupon Purchase"}
                          otherwise={row?.user_purchase_products[0]?.product?.name}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{row.total_cv}</TableCell>
                    <TableCell>{row.total_qv}</TableCell>
                    <TableCell>{row.total_ev}</TableCell>
                    <TableCell>{row.payment_type?.name}</TableCell>
                    <TableCell><ParseDate date={row.date} /></TableCell>
                    <TableCell><Currency>{row.total_amount}</Currency></TableCell>
                    <TableCell>
                      {(() => { const s = getStatusBadge(row); return <Chip label={s.label} size="small" sx={{ bgcolor: s.bgcolor, color: s.color, fontWeight: 700, fontSize: "0.7rem", height: 24 }} />; })()}
                    </TableCell>
                  </TableRow>
                )}
              />
            </DataHandlerTable>
          </Scrollbar>
        </Card>
        <PaginationButtons {...rest} />

        <TableMenu open={openMenu} onClose={handleCloseMenu}>
          <MenuItem onClick={() => setOpenCombo(true)} name="combo">
            <Iconify icon="mdi:eye-outline" />
            {isIt ? "Combo" : "Combo"}
          </MenuItem>
          <MenuItem onClick={() => navigate("view")} name="view">
            <Iconify icon="mdi:eye-outline" />
            {isIt ? "Visualizza" : "View"}
          </MenuItem>
        </TableMenu>

        <Dialog open={openCombo} onClose={() => setOpenCombo(false)} TransitionComponent={Transition}>
          <DialogTitle>{isIt ? "Dettaglio Combo" : "Combo Details"}</DialogTitle>
        </Dialog>
      </Box>
    </Page>
  );
};

export default TeamOrders;
