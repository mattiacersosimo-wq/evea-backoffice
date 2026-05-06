import {
  Button,
  Card,
  Stack,
  Typography,
  Box,
  Chip,
  Grid,
  Skeleton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import CopyCouponButton from "src/components/CopyCouponButton";
import { PATH_DASHBOARD } from "src/routes/paths";
import useCouponPurchase from "./hooks/useCouponPurchase";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";

const CouponList = () => {
  const { state, fetchData, rowStart, ...rest } = useCouponPurchase();
  const { data, loading, isArrayEmpty } = state;

  return (
    <Page title="I Miei Coupon">
      <HeaderBreadcrumbs
        heading="I Miei Coupon"
        links={[
          { name: "Dashboard", href: PATH_DASHBOARD.root },
          { name: "I Miei Coupon" },
        ]}
      />

      {loading ? (
        <Grid container spacing={2}>
          {[0, 1, 2].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : isArrayEmpty || !data?.length ? (
        <Card sx={{ p: 6, textAlign: "center", borderRadius: 3, border: `1px solid ${alpha(ORO, 0.25)}`, background: `linear-gradient(135deg, ${alpha(ORO, 0.04)} 0%, #fff 100%)` }}>
          <Box sx={{ width: 72, height: 72, borderRadius: "50%", bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
            <Iconify icon="mdi:ticket-percent-outline" width={40} sx={{ color: ORO }} />
          </Box>
          <Typography variant="h6" sx={{ color: ESPRESSO, fontWeight: 700 }}>Non hai ancora coupon disponibili</Typography>
          <Typography variant="body2" sx={{ color: MUTED, mt: 1, maxWidth: 480, mx: "auto" }}>
            Effettua un ordine smartship per iniziare a guadagnare coupon dal programma <strong>3 For Free</strong> e dal <strong>Percorso Fedeltà</strong>.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="https://www.myevea.com/"
            target="_blank"
            rel="noopener"
            startIcon={<Iconify icon="mdi:storefront-outline" />}
            sx={{ mt: 3, bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700, textTransform: "none", borderRadius: 2, px: 3 }}
          >
            Vai allo shop
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2}>
          <Map
            list={data}
            render={(coupon) => {
              const amount = parseFloat(coupon.discount || coupon.amount || coupon.total_amount || 0);
              const code = coupon.code || "";
              const rawStart = coupon.start_date;
              const rawEnd = coupon.end_date;
              const startLabel = rawStart ? new Date(rawStart).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" }) : "—";
              const endLabel = rawEnd ? new Date(rawEnd).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" }) : "—";
              const now = new Date();
              const isExpired = rawEnd && now > new Date(rawEnd);
              const isNotStarted = rawStart && now < new Date(rawStart);
              const isActive = coupon.active === 1 && !isExpired && !isNotStarted;
              const isUsed = coupon.uses_count > 0 || coupon.used === 1;
              const typeName = (coupon.type || "").replace(/_/g, " ").replace("programe", "").trim().toUpperCase() || "COUPON";

              const statusLabel = isUsed ? "Utilizzato" : isExpired ? "Scaduto" : isNotStarted ? "Non ancora attivo" : "Attivo";
              const statusColor = isUsed ? "#9E9E9E" : isExpired ? "#E24B4A" : isNotStarted ? "#FF9800" : "#4CAF50";
              const dimmed = isUsed || isExpired;

              return (
                <Grid item xs={12} sm={6} md={4} key={coupon.id}>
                  <Card sx={{
                    borderRadius: 3, overflow: "hidden", height: "100%",
                    border: `1px solid ${dimmed ? "#e0e0e0" : alpha(ORO, 0.3)}`,
                    opacity: dimmed ? 0.65 : 1,
                    transition: "all 0.3s",
                    "&:hover": { transform: dimmed ? "none" : "translateY(-4px)", boxShadow: dimmed ? 1 : 6 },
                  }}>
                    <Box sx={{ display: "flex", height: "100%" }}>
                      <Box sx={{ width: 8, bgcolor: dimmed ? "#ccc" : ORO, flexShrink: 0 }} />
                      <Box sx={{ p: 2.5, flex: 1 }}>
                        {/* Header */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                          <Typography sx={{ fontSize: "0.7rem", color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                            {typeName}
                          </Typography>
                          <Chip label={statusLabel} size="small"
                            sx={{ height: 22, fontSize: "0.65rem", fontWeight: 700, bgcolor: alpha(statusColor, 0.1), color: statusColor }} />
                        </Stack>

                        {/* Amount */}
                        <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: dimmed ? "#aaa" : ORO, lineHeight: 1, mb: 1 }}>
                          €{amount.toFixed(2)}
                        </Typography>

                        {/* Code */}
                        {code && (
                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.5 }}>
                            <Box sx={{ bgcolor: alpha(ORO, 0.06), borderRadius: 1.5, px: 1.5, py: 0.8, display: "inline-block" }}>
                              <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: ESPRESSO, fontFamily: "monospace", letterSpacing: "0.15em" }}>
                                {code}
                              </Typography>
                            </Box>
                            <CopyCouponButton code={code} />
                          </Stack>
                        )}

                        {/* Dates */}
                        <Stack spacing={0.5}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Iconify icon="mdi:calendar-start" width={14} sx={{ color: "#aaa" }} />
                            <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>Dal: <strong>{startLabel}</strong></Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Iconify icon="mdi:calendar-end" width={14} sx={{ color: "#aaa" }} />
                            <Typography sx={{ fontSize: "0.7rem", color: MUTED }}>Al: <strong>{endLabel}</strong></Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              );
            }}
          />
        </Grid>
      )}

      <PaginationButtons {...rest} />
    </Page>
  );
};

export default CouponList;
