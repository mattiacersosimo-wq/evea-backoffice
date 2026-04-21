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
import { Link, useNavigate } from "react-router-dom";
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
import { PATH_USER } from "src/routes/paths";
import Transition from "src/utils/dialog-animation";
import useMyOrders from "./hooks/useMyOrders";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";

const getStatusBadge = (row) => {
  const os = (row?.order_status || "").toLowerCase();
  const fs = (row?.fulfillment_status || "").toLowerCase();
  if (os === "refunded" || os === "cancelled") return { label: "Rimborsato", bgcolor: "#FCEBEB", color: "#A32D2D" };
  if (os === "partially_refunded") return { label: "Parzialmente rimborsato", bgcolor: "#FFF3E0", color: "#E65100" };
  if (fs === "delivered") return { label: "Consegnato", bgcolor: "#EAF3DE", color: "#27500A" };
  if (fs === "fulfilled" || fs === "success") return { label: "Spedito", bgcolor: "#FAF3E0", color: "#854F0B" };
  if (os === "finished" || os === "paid" || os === "complete") return { label: "Pagato", bgcolor: "#E6F1FB", color: "#0C447C" };
  if (os === "processing") return { label: "In lavorazione", bgcolor: "#FFF8E1", color: "#7A6A5C" };
  return { label: "In attesa", bgcolor: "#E8DDCA", color: "#5C4A3A" };
};

const MyOrders = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isIt = i18n.language?.startsWith("it");
  const L = {
    title: isIt ? "I miei Ordini" : "My Orders",
    subtitle: isIt ? "Storico completo dei tuoi acquisti" : "Complete purchase history",
    no: "#",
    invoice: isIt ? "Fattura" : "Invoice",
    product: isIt ? "Prodotto" : "Product",
    payment: isIt ? "Pagamento" : "Payment",
    date: isIt ? "Data" : "Date",
    total: isIt ? "Totale" : "Total",
    status: isIt ? "Stato" : "Status",
    tracking: "Tracking",
    action: isIt ? "Azioni" : "Actions",
  };
  const headers = [L.no, L.invoice, L.product, L.payment, L.date, L.total, L.status, L.tracking, L.action];

  const [openMenu, setOpenMenuActions] = useState(null);
  const handleCloseMenu = () => setOpenMenuActions(null);

  const [openCombo, setOpenCombo] = useState(false);
  const { state, fetchData, rowStart, ...rest } = useMyOrders();
  const { data, ...dataProps } = state;

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
              <Iconify icon="mdi:package-variant-closed" width={28} sx={{ color: ORO }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color={ESPRESSO}>{L.title}</Typography>
              <Typography sx={{ fontSize: "0.82rem", color: MUTED }}>{L.subtitle}</Typography>
            </Box>
          </Stack>
        </Card>

        <Card sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid #f0ece6", boxShadow: "0 1px 3px rgba(44, 26, 14, 0.04)" }}>
          <Scrollbar>
            <DataHandlerTable name="my-orders-table" headers={headers} dataProps={{ ...dataProps }}>
              <Map
                list={data}
                render={(row, i) => (
                  <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 }, transition: "background-color .15s ease", "&:hover": { bgcolor: alpha(ORO, 0.03) } }}>
                    <TableCell component="th" scope="row">{i + rowStart}</TableCell>
                    <TableCell>{row.invoice_id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Ternary
                          when={row?.purchase_type === "coupon_purchase"}
                          then={isIt ? "Acquisto Coupon" : "Coupon Purchase"}
                          otherwise={row?.user_purchase_products[0]?.product?.name}
                        />
                        {row?.user_purchase_products?.product?.name}
                        {row?.product_count == "1" ? null : (
                          <span style={{ margin: "2px", fontSize: "0.78rem", fontWeight: 600, color: MUTED }}>
                            +{parseInt(row?.product_count) - 1}
                          </span>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{row.payment_type?.name}</TableCell>
                    <TableCell><ParseDate date={row.date} /></TableCell>
                    <TableCell><Currency>{row.total_amount}</Currency></TableCell>
                    <TableCell>
                      {(() => { const s = getStatusBadge(row); return <Chip label={s.label} size="small" sx={{ bgcolor: s.bgcolor, color: s.color, fontWeight: 700, fontSize: "0.7rem", height: 24 }} />; })()}
                    </TableCell>
                    <TableCell>
                      {row.tracking_number ? (
                        row.tracking_url ? (
                          <a href={row.tracking_url} target="_blank" rel="noreferrer" style={{ color: ORO, fontWeight: 700, fontSize: "0.78rem", textDecoration: "none" }}>
                            {row.tracking_number}
                          </a>
                        ) : (
                          <span style={{ fontSize: "0.78rem", color: ESPRESSO }}>{row.tracking_number}</span>
                        )
                      ) : (
                        <span style={{ fontSize: "0.72rem", color: "#aaa" }}>—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton LinkComponent={Link} to={PATH_USER.my_orders.view(row.id)} size="small"
                        sx={{ color: ORO, "&:hover": { bgcolor: alpha(ORO, 0.1) } }}>
                        <Iconify icon="mdi:eye-outline" width={20} />
                      </IconButton>
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

export default MyOrders;
