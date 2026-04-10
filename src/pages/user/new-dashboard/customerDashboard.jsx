import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import useAuth from "src/hooks/useAuth";
import axiosInstance from "src/utils/axios";
import fetchUser from "src/utils/fetchUser";
import { WP_URL } from "src/config";
import CustomerCommunityBanner from "src/components/CustomerCommunityBanner";

// ── Palette ──
const ORO = "#B8963B";
const ORO_LIGHT = "#D4AF5A";
const ESPRESSO = "#2C1A0E";
const WARM_GRAY = "#6B5E54";

const cardSx = {
  bgcolor: "#fff",
  borderRadius: 3,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
  border: "1px solid #f0ece6",
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

// ── Badge config ──
const BADGES = [
  { key: "bronze", name: "Bronze Ambassador", icon: "mdi:shield-outline", color: "#CD7F32", requirement: (d) => d.hasFirstOrder, tooltip: "Completa il tuo primo ordine" },
  { key: "silver", name: "Silver Ambassador", icon: "mdi:shield-half-full", color: "#C0C0C0", requirement: (d) => d.consecutiveMonths >= 3, tooltip: "Mantieni lo smartship attivo per 3 mesi consecutivi" },
  { key: "platinum", name: "Platinum Ambassador", icon: "mdi:lightning-bolt", color: "#8B7FC7", requirement: (d) => d.consecutiveMonths >= 6 && d.friendsInvited >= 1, tooltip: "6 mesi consecutivi di smartship + invita 1 amico" },
  { key: "gold", name: "Gold Ambassador", icon: "mdi:trophy", color: "#FFD700", requirement: (d) => d.consecutiveMonths >= 12 && d.friendsInvited >= 3, tooltip: "12 mesi consecutivi + invita 3 amici (3 For Free)" },
  { key: "legend", name: "Legend Ambassador", icon: "mdi:diamond-stone", color: "#00BCD4", requirement: (d) => d.consecutiveMonths >= 24 && d.friendsInvited >= 5, tooltip: "24 mesi consecutivi + invita 5 amici" },
];

// ── Data hooks ──
const useFetch = (fetcher) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const r = await fetcher();
        if (!off) setData(r);
      } catch (e) {
      } finally {
        if (!off) setLoading(false);
      }
    })();
    return () => { off = true; };
  }, []);
  return { data, loading };
};

const useHero = () =>
  useFetch(async () => {
    const { data } = await axiosInstance.get("api/wp/dashboard/hero");
    return data?.data || {};
  });

const useThreeFF = () =>
  useFetch(async () => {
    const { data } = await fetchUser("affiliate-dashboard/threeff-Progressbar");
    return data?.data?.[0];
  });

const useROB = () =>
  useFetch(async () => {
    const { data } = await fetchUser("affiliate-dashboard/rob-Progressbar");
    return data?.data?.[0];
  });

const useRecentOrders = () =>
  useFetch(async () => {
    const { data } = await fetchUser.get("my-orders", {
      params: { page: 1, per_page: 5 },
    });
    const list = data?.data?.data?.slice(0, 5) || [];
    return { orders: list, totalOrders: data?.data?.total || list.length };
  });

const useCoupons = () =>
  useFetch(async () => {
    const { data } = await fetchUser("coupon-purchase?page=1");
    return data?.data?.data?.slice(0, 4) || [];
  });

// ═══════════════════════════════════════════════
// HERO — clean customer card, no rank/progress
// ═══════════════════════════════════════════════
const HeroCard = ({ hero, ff, rob, totalOrders = 0 }) => {
  const { user } = useAuth();

  const profile = user?.user_profile || {};
  const fullName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    user?.username || "";

  // Badge data
  const consecutiveMonths = rob?.current_consecutive_months || 0;
  const friendsInvited = ff?.current_qualified_customer_count || 0;
  const hasFirstOrder = (hero?.total_orders ?? totalOrders ?? 0) > 0;
  const badgeData = { hasFirstOrder, consecutiveMonths, friendsInvited };

  // Find current badge
  let currentBadgeIndex = -1;
  BADGES.forEach((b, i) => { if (b.requirement(badgeData)) currentBadgeIndex = i; });
  const currentBadge = currentBadgeIndex >= 0 ? BADGES[currentBadgeIndex] : null;

  return (
    <Card
      sx={{
        bgcolor: "#FAF6EF",
        color: ESPRESSO,
        borderRadius: 4,
        p: { xs: 3, md: 4 },
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${alpha(ORO, 0.2)}`,
      }}
    >
      <Box sx={{ position: "absolute", bottom: -30, right: -30, width: 120, height: 120, borderRadius: "50%", bgcolor: alpha(ORO, 0.08) }} />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        alignItems={{ xs: "center", sm: "flex-start" }}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Avatar
          src={profile.profile_image}
          sx={{
            width: 80, height: 80,
            border: `3px solid ${alpha(currentBadge?.color || ORO, 0.4)}`,
            bgcolor: alpha(currentBadge?.color || ORO, 0.15),
            color: currentBadge?.color || ORO,
            fontSize: 32, fontWeight: 700,
            boxShadow: `0 0 0 6px ${alpha(currentBadge?.color || ORO, 0.1)}`,
          }}
        >
          {fullName.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ flex: 1, width: "100%" }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="h5" fontWeight={700} sx={{ color: ESPRESSO }}>
              {fullName}
            </Typography>
            {currentBadge && (
              <Chip
                label={currentBadge.name}
                size="small"
                icon={<Iconify icon={currentBadge.icon} width={16} sx={{ color: `${currentBadge.color} !important` }} />}
                sx={{
                  bgcolor: alpha(currentBadge.color, 0.12),
                  color: currentBadge.color,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  height: 26,
                  border: `1px solid ${alpha(currentBadge.color, 0.3)}`,
                }}
              />
            )}
          </Stack>
          <Typography sx={{ fontSize: "0.8rem", color: WARM_GRAY, mt: 0.3 }}>
            Benvenuto nella tua area personale
          </Typography>

          {/* Badge row */}
          <Stack direction="row" spacing={1.5} mt={2.5}>
            {BADGES.map((badge, i) => {
              const unlocked = badge.requirement(badgeData);
              const isCurrent = i === currentBadgeIndex;
              return (
                <Tooltip
                  key={badge.key}
                  arrow
                  title={
                    <Box sx={{ p: 0.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.8rem" }}>{badge.name}</Typography>
                      <Typography sx={{ fontSize: "0.72rem", mt: 0.3 }}>
                        {unlocked ? "✓ Sbloccato!" : badge.tooltip}
                      </Typography>
                    </Box>
                  }
                >
                  <Box sx={{
                    width: 44, height: 44, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s",
                    cursor: "pointer",
                    ...(unlocked ? {
                      bgcolor: alpha(badge.color, 0.15),
                      border: `2px solid ${badge.color}`,
                      boxShadow: isCurrent ? `0 0 12px ${alpha(badge.color, 0.4)}` : "none",
                    } : {
                      bgcolor: "#f0ece6",
                      border: "2px solid #e0d8cc",
                      opacity: 0.4,
                    }),
                    "&:hover": { opacity: 1, transform: "scale(1.1)" },
                  }}>
                    <Iconify icon={badge.icon} width={22}
                      sx={{ color: unlocked ? badge.color : "#bbb" }} />
                  </Box>
                </Tooltip>
              );
            })}
          </Stack>
          )}
        </Box>
      </Stack>
    </Card>
  );
};

// ═══════════════════════════════════════════════
// TICKER SCORREVOLE
// ═══════════════════════════════════════════════
const TICKER_MESSAGES = [
  "🚚 Spedizione gratuita a partire da €97 di acquisti",
  "💰 -10% su ogni ordine con lo Smartship attivo",
  "🎁 Invita 3 amici e guadagna fino a €81 di bonus",
  "🎟️ Coupon €30 ogni 3 consegne consecutive",
  "☕ Scopri i nostri prodotti wellness su myevea.com",
];

const Ticker = () => {
  const doubled = [...TICKER_MESSAGES, ...TICKER_MESSAGES];
  return (
    <Box sx={{
      overflow: "hidden", bgcolor: alpha(ORO, 0.06), borderRadius: 2,
      border: `1px solid ${alpha(ORO, 0.12)}`, py: 1.8, mt: 2,
    }}>
      <Box sx={{
        display: "flex", whiteSpace: "nowrap",
        animation: "tickerScroll 20s linear infinite",
        "@keyframes tickerScroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      }}>
        {doubled.map((msg, i) => (
          <Typography key={i} component="span" sx={{
            fontSize: "0.92rem", fontWeight: 600, color: ESPRESSO,
            mx: 4, flexShrink: 0,
          }}>
            {msg}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

// ═══════════════════════════════════════════════
// INVITA 3 AMICI (3FF) with tooltip
// ═══════════════════════════════════════════════
const ThreeFFCard = ({ ff, loading = false }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const referralLink = user?.username ? `${WP_URL}?ref=${user.username}` : "";
  const copy = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    enqueueSnackbar("Link copiato!");
  };

  const required = ff?.required_customers || 3;
  const current = ff?.current_qualified_customer_count || 0;
  const bonus = ff?.current_bonus_amount || 0;
  const customers = ff?.current_customers_largest_orders || [];
  const slots = Array.from({ length: required }, (_, i) => customers[i] || null);

  return (
    <Card sx={{ ...cardSx, p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Iconify icon="mdi:gift-outline" width={20} sx={{ color: ORO }} />
        </Box>
        <Box>
          <Tooltip
            title="Porta 3 amici che ordinano almeno €30 ciascuno e ricevi un bonus fino a €81. Condividi il tuo link!"
            arrow
            placement="top"
          >
            <Typography variant="subtitle2" fontWeight={700} color={ESPRESSO} sx={{ cursor: "help", borderBottom: `1px dashed ${alpha(WARM_GRAY, 0.3)}` }}>
              Invita 3 Amici
            </Typography>
          </Tooltip>
          <Typography variant="caption" sx={{ color: WARM_GRAY, lineHeight: 1 }}>
            {t("evea.bonus_3ff") || "Ottieni un bonus per ogni amico"}
          </Typography>
        </Box>
      </Stack>

      {loading ? (
        <Stack spacing={1.5} sx={{ flex: 1 }}>
          <Skeleton height={56} variant="rounded" />
          <Skeleton height={40} variant="rounded" />
        </Stack>
      ) : (
        <>
          <Stack direction="row" spacing={2.5} justifyContent="center" mb={2}>
            {slots.map((c, i) => (
              <Stack key={i} alignItems="center" spacing={0.5}>
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: c ? alpha(ORO, 0.12) : "#f5f5f5",
                    color: c ? ORO : "#ccc",
                    border: c ? `2px solid ${ORO}` : "2px dashed #ddd",
                    transition: "all 0.3s",
                  }}
                >
                  {c ? (
                    <Iconify icon="mdi:check-bold" width={24} />
                  ) : (
                    <Iconify icon="mdi:account-plus-outline" width={24} />
                  )}
                </Avatar>
                <Typography variant="caption" sx={{ color: c ? ESPRESSO : "#aaa", maxWidth: 70, fontWeight: c ? 600 : 400 }} noWrap>
                  {c?.customer_name || `Amico ${i + 1}`}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Box sx={{ textAlign: "center", bgcolor: "#fafafa", borderRadius: 2, py: 1.5, mb: 2 }}>
            <Typography variant="body2" sx={{ color: WARM_GRAY }}>
              <b style={{ color: ESPRESSO }}>{current}/{required}</b> amici invitati
              {bonus > 0 && (
                <>
                  <Divider component="span" orientation="vertical" sx={{ mx: 1.5, height: 14, display: "inline-block", borderColor: "#ddd" }} />
                  Bonus: <b style={{ color: ORO, fontSize: "1.1em" }}>€{bonus}</b>
                </>
              )}
            </Typography>
          </Box>
        </>
      )}

      <Box sx={{ mt: "auto" }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Iconify icon="mdi:content-copy" />}
          onClick={copy}
          sx={{
            bgcolor: ORO,
            color: "#fff",
            "&:hover": { bgcolor: "#A07E2F" },
            fontWeight: 700,
            borderRadius: 2,
            py: 1.2,
            textTransform: "none",
            fontSize: "0.875rem",
            boxShadow: `0 4px 12px ${alpha(ORO, 0.3)}`,
          }}
        >
          Copia il tuo link
        </Button>
      </Box>
    </Card>
  );
};

// ═══════════════════════════════════════════════
// ROB — Percorso Fedeltà (unchanged)
// ═══════════════════════════════════════════════
const CYCLE_LEN = 12;
const PAGE_SIZE = 8;
const COUPON_MONTHS = [3, 6, 9];

const ROBCard = ({ rob, loading = false }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);

  const totalConsec = rob?.current_consecutive_months || 0;
  const cycleNum = Math.floor(totalConsec / CYCLE_LEN) + 1;
  const posInCycle = totalConsec % CYCLE_LEN;

  const allMilestones = Array.from({ length: CYCLE_LEN }, (_, i) => {
    const isCoupon = COUPON_MONTHS.includes(i);
    const isFirstEver = cycleNum === 1 && i === 0;
    let label;
    if (isFirstEver) label = t("evea.first_delivery") || "1ª consegna";
    else if (isCoupon) label = "-10% + €30";
    else label = "-10%";
    return { month: i + 1, completed: i < posInCycle, isCurrent: i === posInCycle, label, isCoupon };
  });

  const totalPages = Math.ceil(CYCLE_LEN / PAGE_SIZE);
  const pageStart = page * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, CYCLE_LEN);
  const visible = allMilestones.slice(pageStart, pageEnd);
  const completedOnPage = visible.filter((m) => m.completed).length;
  const connectorPct = visible.length > 1 ? Math.round((completedOnPage / (visible.length - 1)) * 100) : 0;

  const discountMonths = cycleNum === 1 ? Math.max(0, posInCycle - 1) : 11 + (cycleNum - 2) * 12 + posInCycle;
  const couponsThisCycle = COUPON_MONTHS.filter((i) => i < posInCycle).length;
  const couponsEarned = (cycleNum - 1) * 3 + couponsThisCycle;
  const couponValue = couponsEarned * 30;

  return (
    <Card sx={{ ...cardSx, p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Iconify icon="mdi:calendar-heart" width={20} sx={{ color: ORO }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={700} color={ESPRESSO}>
              {t("evea.loyalty_path") || "Percorso Fedeltà"}
            </Typography>
            <Typography variant="caption" sx={{ color: WARM_GRAY, lineHeight: 1 }}>
              {t("evea.loyalty_sub") || "-10% per sempre + coupon ogni 3 consegne"}
            </Typography>
          </Box>
        </Stack>
        {!loading && totalConsec > 0 && (
          <Chip label={`Ciclo ${cycleNum} · ${posInCycle}/${CYCLE_LEN}`} size="small"
            sx={{ bgcolor: alpha(ORO, 0.1), color: ORO, fontWeight: 700, fontSize: "0.7rem", height: 24 }} />
        )}
      </Stack>

      {loading ? (
        <Skeleton height={100} variant="rounded" sx={{ flex: 1 }} />
      ) : (
        <>
          <Stack direction="row" alignItems="center" spacing={0.5} mb={2}>
            <IconButton size="small" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
              sx={{ width: 28, height: 28, color: page === 0 ? "#ddd" : ORO }}>
              <Iconify icon="mdi:chevron-left" width={20} />
            </IconButton>
            <Box sx={{ flex: 1, position: "relative", px: 0.5 }}>
              <Box sx={{ position: "absolute", top: 18, left: 20, right: 20, height: 2, background: `linear-gradient(90deg, ${ORO} ${connectorPct}%, #eee ${connectorPct}%)`, zIndex: 0 }} />
              <Stack direction="row" justifyContent="space-between" sx={{ position: "relative", zIndex: 1 }}>
                {visible.map((m) => (
                  <Stack key={m.month} alignItems="center" sx={{ flex: 1 }}>
                    <Box sx={{
                      width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: "0.75rem", transition: "all 0.3s",
                      ...(m.completed ? { bgcolor: ORO, color: "#fff", boxShadow: `0 2px 8px ${alpha(ORO, 0.35)}` }
                        : m.isCurrent ? { bgcolor: "#fff", color: ORO, border: `2px solid ${ORO}`, boxShadow: `0 0 0 4px ${alpha(ORO, 0.12)}` }
                        : { bgcolor: "#f5f5f5", color: "#bbb" }),
                    }}>
                      {m.completed ? <Iconify icon="mdi:check" width={18} /> : m.month}
                    </Box>
                    <Typography sx={{ mt: 0.5, fontSize: "0.62rem", fontWeight: m.isCoupon ? 700 : 500,
                      color: m.isCoupon && m.completed ? ORO : m.completed ? ORO : m.isCurrent ? ESPRESSO : "#bbb",
                      textAlign: "center", lineHeight: 1.2 }}>
                      {m.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
            <IconButton size="small" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              sx={{ width: 28, height: 28, color: page >= totalPages - 1 ? "#ddd" : ORO }}>
              <Iconify icon="mdi:chevron-right" width={20} />
            </IconButton>
          </Stack>

          <Stack direction="row" justifyContent="center" spacing={0.5} mb={2}>
            {Array.from({ length: totalPages }, (_, i) => (
              <Box key={i} onClick={() => setPage(i)}
                sx={{ width: i === page ? 16 : 6, height: 6, borderRadius: 3, bgcolor: i === page ? ORO : "#ddd", transition: "all 0.3s", cursor: "pointer" }} />
            ))}
          </Stack>

          <Box sx={{ bgcolor: alpha(ORO, 0.06), borderRadius: 2, p: 2, mb: 2, textAlign: "center" }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5} mb={0.5}>
              <Iconify icon="mdi:piggy-bank-outline" width={18} sx={{ color: ORO }} />
              <Typography sx={{ fontSize: "0.75rem", color: WARM_GRAY, fontWeight: 600 }}>
                {t("evea.your_savings") || "Il tuo risparmio finora"}
              </Typography>
            </Stack>
            {totalConsec === 0 ? (
              <Typography sx={{ fontSize: "0.8rem", color: WARM_GRAY }}>
                {t("evea.start_subscription") || "Attiva il tuo abbonamento per iniziare a risparmiare!"}
              </Typography>
            ) : (
              <Stack direction="row" justifyContent="center" divider={<Typography sx={{ mx: 1, color: "#ddd" }}>+</Typography>}>
                {discountMonths > 0 && (
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: ESPRESSO, fontSize: "1.1rem" }}>{discountMonths}x -10%</Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: WARM_GRAY }}>{t("evea.discounted_deliveries") || "consegne con sconto"}</Typography>
                  </Box>
                )}
                {couponValue > 0 && (
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: ORO, fontSize: "1.1rem" }}>€{couponValue}</Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: WARM_GRAY }}>{t("evea.in_gift_coupons") || "in coupon regalo"}</Typography>
                  </Box>
                )}
              </Stack>
            )}
          </Box>
        </>
      )}

      <Box sx={{ mt: "auto" }}>
        <Button fullWidth variant="outlined" startIcon={<Iconify icon="mdi:cog-outline" />} href="/user/recurring-orders"
          sx={{ borderColor: "#e0e0e0", color: ESPRESSO, "&:hover": { borderColor: ORO, bgcolor: alpha(ORO, 0.04) }, fontWeight: 600, borderRadius: 2, py: 1.2, textTransform: "none" }}>
          {t("evea.manage_subscription") || "Gestisci il mio abbonamento"}
        </Button>
      </Box>
    </Card>
  );
};

// ═══════════════════════════════════════════════
// ORDINI RECENTI
// ═══════════════════════════════════════════════
const RecentOrders = ({ orders = [], loading = false }) => {

  if (loading) return <Skeleton height={200} variant="rounded" sx={{ borderRadius: 3 }} />;
  if (!orders.length) return null;

  return (
    <Card sx={{ ...cardSx, p: 2.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Iconify icon="mdi:package-variant-closed" width={18} sx={{ color: ORO }} />
          </Box>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>Ordini Recenti</Typography>
        </Stack>
        <Button size="small" href="/user/online-store/my-orders" sx={{ textTransform: "none", color: ORO, fontWeight: 600, fontSize: "0.75rem" }}>
          Vedi tutti
        </Button>
      </Stack>
      <Stack spacing={0}>
        {orders.map((o, idx) => {
          const rawStatus = (o.active_status || o.order_status || o.status || "").toLowerCase();
          const isPaid = rawStatus === "active" || rawStatus === "finished" || rawStatus === "completed" || rawStatus === "";
          const isProcessing = rawStatus === "processing" || rawStatus === "pending";
          const isRefunded = rawStatus === "refunded" || rawStatus === "cancelled";
          const statusColor = isPaid ? "#4CAF50" : isProcessing ? "#FF9800" : isRefunded ? "#E24B4A" : "#4CAF50";
          const statusLabel = isPaid ? "Completato" : isProcessing ? "In lavorazione" : isRefunded ? "Rimborsato" : "Completato";
          const date = (o.date || o.created_at) ? new Date(o.date || o.created_at).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" }) : "";
          const productName = o.user_purchase_products?.[0]?.product?.name || o.product_name || o.purchase_product?.name || "";
          const productCount = parseInt(o.product_count || "1");
          const invoiceId = o.invoice_id || "";
          const paymentMethod = o.payment_type?.name || "";
          const tracking = o.tracking_number || "";
          const trackingUrl = o.tracking_url || "";
          return (
            <Stack key={o.id} direction="row" alignItems="center" spacing={2}
              sx={{ py: 1.5, borderBottom: idx < orders.length - 1 ? "1px solid #f5f0e8" : "none", "&:hover": { bgcolor: alpha(ORO, 0.02) }, transition: "all 0.2s" }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(statusColor, 0.08), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Iconify icon={isPaid ? "mdi:check-circle-outline" : isProcessing ? "mdi:clock-outline" : "mdi:package-variant"} width={20} sx={{ color: statusColor }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: ESPRESSO }} noWrap>
                    {productName || `Ordine #${o.id}`}
                  </Typography>
                  {productCount > 1 && (
                    <Chip label={`+${productCount - 1}`} size="small" sx={{ height: 18, fontSize: "0.6rem", bgcolor: alpha(ORO, 0.1), color: ORO }} />
                  )}
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" mt={0.3}>
                  <Typography sx={{ fontSize: "0.68rem", color: WARM_GRAY }}>{date}</Typography>
                  {invoiceId && <Typography sx={{ fontSize: "0.62rem", color: "#bbb" }}>#{invoiceId}</Typography>}
                  {paymentMethod && <Typography sx={{ fontSize: "0.62rem", color: "#bbb" }}>{paymentMethod}</Typography>}
                </Stack>
                {tracking && (
                  <Stack direction="row" alignItems="center" spacing={0.5} mt={0.3}>
                    <Iconify icon="mdi:truck-outline" width={14} sx={{ color: "#4CAF50" }} />
                    {trackingUrl ? (
                      <a href={trackingUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.65rem", color: ORO, fontWeight: 600, textDecoration: "none" }}>{tracking}</a>
                    ) : (
                      <Typography sx={{ fontSize: "0.65rem", color: WARM_GRAY }}>{tracking}</Typography>
                    )}
                  </Stack>
                )}
              </Box>
              <Chip label={statusLabel} size="small"
                sx={{ height: 22, fontSize: "0.62rem", fontWeight: 700, bgcolor: alpha(statusColor, 0.1), color: statusColor, minWidth: 85 }} />
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: ESPRESSO, minWidth: 75, textAlign: "right" }}>
                €{Number(o.total_amount || o.price || 0).toFixed(2)}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Card>
  );
};

// ═══════════════════════════════════════════════
// COUPON
// ═══════════════════════════════════════════════
const CouponsSection = ({ coupons, loading }) => {
  const { t } = useTranslation();

  if (loading) return (
    <Grid container spacing={2}>
      {[0, 1].map((i) => (
        <Grid item xs={12} sm={6} key={i}>
          <Skeleton variant="rounded" height={100} sx={{ borderRadius: 3 }} />
        </Grid>
      ))}
    </Grid>
  );

  if (!coupons?.length) return (
    <Box sx={{ textAlign: "center", py: 5, bgcolor: "#fafafa", borderRadius: 3 }}>
      <Iconify icon="mdi:ticket-outline" width={36} sx={{ color: "#ddd", mb: 1 }} />
      <Typography variant="body2" color="text.secondary">
        {t("evea.no_coupons") || "Nessun coupon disponibile"}
      </Typography>
    </Box>
  );

  return (
    <Grid container spacing={2}>
      {coupons.map((coupon, i) => {
        const amount = parseFloat(coupon.discount || coupon.amount || coupon.total_amount || 0);
        const code = coupon.code || "";
        const rawDate = coupon.end_date || coupon.expiry_date || coupon.expire_date;
        const expiryLabel = rawDate ? new Date(rawDate).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" }) : "Nessuna scadenza";
        const isUsed = coupon.uses_count > 0 || coupon.used === 1;
        const typeName = (coupon.type || coupon.coupon_type || "").replace(/_/g, " ").replace("programe", "").trim().toUpperCase() || "COUPON";

        return (
          <Grid item xs={12} sm={6} md={4} key={coupon.id || i}>
            <Card sx={{
              borderRadius: 3, overflow: "hidden", height: "100%",
              border: `1px solid ${isUsed ? "#e0e0e0" : alpha(ORO, 0.3)}`,
              opacity: isUsed ? 0.6 : 1,
              bgcolor: "#fff",
            }}>
              <Box sx={{ display: "flex", height: "100%" }}>
                {/* Left accent */}
                <Box sx={{ width: 6, bgcolor: isUsed ? "#ccc" : ORO, flexShrink: 0 }} />
                <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography sx={{ fontSize: "0.75rem", color: WARM_GRAY, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, mb: 0.3 }}>
                        {typeName}
                      </Typography>
                      <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: isUsed ? "#aaa" : ORO, lineHeight: 1 }}>
                        €{amount.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: alpha(isUsed ? "#ccc" : ORO, 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Iconify icon={isUsed ? "mdi:check-circle" : "mdi:ticket-percent"} width={24} sx={{ color: isUsed ? "#aaa" : ORO }} />
                    </Box>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.5 }}>
                    {code && (
                      <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: ESPRESSO, bgcolor: alpha(ORO, 0.06), px: 1.2, py: 0.3, borderRadius: 1.5, fontFamily: "monospace", letterSpacing: "0.1em" }}>
                        {code}
                      </Typography>
                    )}
                    <Typography sx={{ fontSize: "0.65rem", color: "#aaa" }}>
                      {isUsed ? "Utilizzato" : `Scade il ${expiryLabel}`}
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

// ═══════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════
const UserDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: hero } = useHero();
  const { data: ff, loading: ffLoading } = useThreeFF();
  const { data: rob, loading: robLoading } = useROB();
  const { data: orderData, loading: ordersLoading } = useRecentOrders();
  const { data: coupons, loading: couponsLoading } = useCoupons();
  const orders = orderData?.orders || [];
  const totalOrders = orderData?.totalOrders || 0;
  return (
    <Page title="Dashboard">
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4 }}>
        <HeroCard hero={hero} ff={ff} rob={rob} totalOrders={totalOrders} badgesLoading={ffLoading || robLoading} />
        <Box sx={{ mt: 2 }}><CustomerCommunityBanner /></Box>
        <Ticker />

        {/* Loyalty Discount Banner */}
        {(() => {
          const smartshipStatus = hero?.smartship_status || "none";
          const hasDiscount = smartshipStatus === "active" || (user?.has_smartship_discount === 1 && smartshipStatus !== "paused");

          if (smartshipStatus === "paused") {
            return (
              <Box sx={{ bgcolor: "#FFF8E1", border: "1px solid #F9A825", borderRadius: 3, p: 2, mt: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Iconify icon="mdi:pause-circle-outline" width={24} sx={{ color: "#F57F17" }} />
                  <Box>
                    <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#E65100" }}>
                      Smartship in pausa — lo sconto del 10% è sospeso
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "#BF360C" }}>
                      Riprendi il tuo abbonamento per continuare a risparmiare
                    </Typography>
                  </Box>
                </Stack>
                <Button size="small" variant="contained" href="/user/recurring-orders"
                  sx={{ bgcolor: "#F57F17", "&:hover": { bgcolor: "#E65100" }, textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
                  Riprendi
                </Button>
              </Box>
            );
          }

          return hasDiscount ? (
            <Box sx={{ bgcolor: "#EAF3DE", border: "1px solid #4A5C3A", borderRadius: 3, p: 2, mt: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Iconify icon="mdi:check-circle" width={24} sx={{ color: "#4A5C3A" }} />
              <Box>
                <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#27500A" }}>
                  {t("evea.loyalty_active") || "Sconto Fedeltà attivo — 10% su tutti i tuoi acquisti"}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#4A5C3A" }}>
                  {t("evea.loyalty_active_sub") || "Mantieni il tuo smartship attivo per continuare a risparmiare"}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ bgcolor: "#FAF6EF", border: `1px solid ${alpha(ORO, 0.2)}`, borderRadius: 3, p: 2, mt: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Iconify icon="mdi:tag-heart-outline" width={24} sx={{ color: ORO }} />
                <Box>
                  <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: ESPRESSO }}>
                    {t("evea.loyalty_inactive") || "Attiva lo Smartship per ottenere il 10% su tutti i tuoi ordini"}
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: WARM_GRAY }}>
                    {t("evea.loyalty_inactive_sub") || "Abbonati ora e risparmia su ogni acquisto"}
                  </Typography>
                </Box>
              </Stack>
              <Button size="small" variant="contained" href={`${WP_URL}/collections/all`} target="_blank"
                sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
                {t("evea.activate_now") || "Attiva ora"}
              </Button>
            </Box>
          );
        })()}

        {/* Ordini recenti */}
        <Box sx={{ mt: 3 }}>
          <RecentOrders orders={orders} loading={ordersLoading} />
        </Box>

        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            <ThreeFFCard ff={ff} loading={ffLoading} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ROBCard rob={rob} loading={robLoading} />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Iconify icon="mdi:ticket-percent-outline" width={22} sx={{ color: ORO }} />
            <Typography variant="h6" fontWeight={700} color={ESPRESSO}>
              I Tuoi Coupon Premio
            </Typography>
          </Stack>
          <CouponsSection coupons={coupons} loading={couponsLoading} />
        </Box>
      </Box>
    </Page>
  );
};

export default UserDashboard;
