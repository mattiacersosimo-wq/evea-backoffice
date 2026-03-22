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
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import useAuth from "src/hooks/useAuth";
import axiosInstance from "src/utils/axios";
import fetchUser from "src/utils/fetchUser";
import { WP_URL } from "src/config";

// ── Palette ──
const ORO = "#B8963B";
const ORO_LIGHT = "#D4AF5A";
const ESPRESSO = "#2C1A0E";
const WARM_GRAY = "#6B5E54";

// shared card style — white, subtle shadow, rounded
const cardSx = {
  bgcolor: "#fff",
  borderRadius: 3,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
  border: "1px solid #f0ece6",
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

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
        console.error(e);
      } finally {
        if (!off) setLoading(false);
      }
    })();
    return () => { off = true; };
  }, []);
  return { data, loading };
};

const useRankSummary = () =>
  useFetch(async () => {
    const { data } = await axiosInstance.get("api/user/affiliate-dashboard/rank-summery");
    return data?.data;
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

const useCoupons = () =>
  useFetch(async () => {
    const { data } = await fetchUser("coupon-purchase?page=1");
    return data?.data?.data?.slice(0, 4) || [];
  });

// ═══════════════════════════════════════════════
// HERO — gradient oro, avatar, rank, progress
// ═══════════════════════════════════════════════
const HeroCard = () => {
  const { user } = useAuth();
  const { data: rankData, loading } = useRankSummary();

  const profile = user?.user_profile || {};
  const fullName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    user?.username || "";
  const currentRank = user?.rank?.rank_name || "Starter";
  const nextRank = user?.rank?.next_rank || "";

  let pct = 0;
  let pctLabel = "";
  if (rankData?.length) {
    const f = rankData[0];
    const earned = f?.earned || 0;
    const req = f?.required || 1;
    pct = Math.min(100, Math.round((earned / req) * 100));
    pctLabel = `${earned} / ${req}`;
  }

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
      {/* decorative oro accent — angolo in basso a destra */}
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          bgcolor: alpha(ORO, 0.08),
        }}
      />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        alignItems={{ xs: "center", sm: "flex-start" }}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Avatar
          src={profile.profile_image}
          sx={{
            width: 80,
            height: 80,
            border: "3px solid rgba(255,255,255,0.3)",
            bgcolor: alpha(ORO, 0.25),
            color: "#fff",
            fontSize: 32,
            fontWeight: 700,
            boxShadow: `0 0 0 6px ${alpha(ORO, 0.15)}`,
          }}
        >
          {fullName.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ flex: 1, width: "100%" }}>
          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
            <Typography variant="h5" fontWeight={700} sx={{ color: "#fff" }}>
              {fullName}
            </Typography>
            <Chip
              label={currentRank}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.15)",
                color: ORO_LIGHT,
                fontWeight: 700,
                fontSize: "0.72rem",
                height: 26,
                borderRadius: "13px",
                border: `1px solid ${alpha(ORO_LIGHT, 0.3)}`,
                backdropFilter: "blur(4px)",
              }}
            />
          </Stack>

          {nextRank && (
            <Box sx={{ mt: 2, maxWidth: 400 }}>
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" sx={{ color: "#7A6A5C" }}>
                  Prossimo rank: <b style={{ color: ORO_LIGHT }}>{nextRank}</b>
                </Typography>
                {loading ? (
                  <Skeleton width={50} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                ) : (
                  <Typography variant="caption" sx={{ color: "#7A6A5C" }}>
                    {pctLabel}
                  </Typography>
                )}
              </Stack>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.12)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                    background: `linear-gradient(90deg, ${ORO_LIGHT}, ${ORO})`,
                  },
                }}
              />
            </Box>
          )}

          {/* perks row */}
          <Stack direction="row" spacing={1.5} mt={2.5}>
            {[
              { icon: "mdi:truck-fast-outline", text: "Spedizione gratis > €97" },
              { icon: "mdi:lightning-bolt-outline", text: "Early Access" },
              { icon: "mdi:star-circle-outline", text: "Premium Content" },
            ].map((p) => (
              <Box
                key={p.text}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  bgcolor: "rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  px: 1.5,
                  py: 0.5,
                }}
              >
                <Iconify icon={p.icon} width={16} sx={{ color: ORO_LIGHT }} />
                <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C", whiteSpace: "nowrap" }}>
                  {p.text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
};

// ═══════════════════════════════════════════════
// 3 FOR FREE
// ═══════════════════════════════════════════════
const ThreeFFCard = () => {
  const { user } = useAuth();
  const { data: ff, loading } = useThreeFF();
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
          <Typography variant="subtitle2" fontWeight={700} color={ESPRESSO}>
            Regala EVEA
          </Typography>
          <Typography variant="caption" sx={{ color: WARM_GRAY, lineHeight: 1 }}>
            Bonus 3 For Free
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
              <Divider component="span" orientation="vertical" sx={{ mx: 1.5, height: 14, display: "inline-block", borderColor: "#ddd" }} />
              Premio: <b style={{ color: ORO, fontSize: "1.1em" }}>€{bonus}</b>
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
          Copia e Invita Ora
        </Button>
      </Box>
    </Card>
  );
};

// ═══════════════════════════════════════════════
// ROB — Recurring Order Bonus (ciclo 12 mesi, paginato 8+4)
// 1ª consegna → -10% per sempre dal 2° → coupon €30 al 4°,7°,10° ogni 3
// ═══════════════════════════════════════════════
const CYCLE_LEN = 12;
const PAGE_SIZE = 8;

const COUPON_MONTHS = [3, 6, 9]; // 0-indexed: mese 4, 7, 10

const ROBCard = () => {
  const { data: rob, loading } = useROB();
  const [page, setPage] = useState(0);

  const totalConsec = rob?.current_consecutive_months || 0;
  const cycleNum = Math.floor(totalConsec / CYCLE_LEN) + 1;
  const posInCycle = totalConsec % CYCLE_LEN;

  const allMilestones = Array.from({ length: CYCLE_LEN }, (_, i) => {
    const isCoupon = COUPON_MONTHS.includes(i);
    // solo il primissimo mese in assoluto (ciclo 1, mese 1) è senza sconto
    const isFirstEver = cycleNum === 1 && i === 0;
    let label;
    if (isFirstEver) label = "1ª consegna";
    else if (isCoupon) label = "-10% + €30";
    else label = "-10%";
    return {
      month: i + 1,
      completed: i < posInCycle,
      isCurrent: i === posInCycle,
      label,
      isCoupon,
    };
  });

  const totalPages = Math.ceil(CYCLE_LEN / PAGE_SIZE); // 2
  const pageStart = page * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, CYCLE_LEN);
  const visible = allMilestones.slice(pageStart, pageEnd);

  const completedOnPage = visible.filter((m) => m.completed).length;
  const connectorPct = visible.length > 1
    ? Math.round((completedOnPage / (visible.length - 1)) * 100)
    : 0;

  // savings: -10% from month 2 of cycle 1, then every month from cycle 2+
  // cycle 1: 11 discount months (all except month 1), cycle 2+: all 12
  const discountMonths = cycleNum === 1
    ? Math.max(0, posInCycle - 1)
    : 11 + (cycleNum - 2) * 12 + posInCycle;
  const couponsThisCycle = COUPON_MONTHS.filter((i) => i < posInCycle).length;
  const couponsEarned = (cycleNum - 1) * 3 + couponsThisCycle;
  const couponValue = couponsEarned * 30;

  return (
    <Card sx={{ ...cardSx, p: 3 }}>
      {/* header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Iconify icon="mdi:calendar-heart" width={20} sx={{ color: ORO }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={700} color={ESPRESSO}>
              Percorso Fedeltà
            </Typography>
            <Typography variant="caption" sx={{ color: WARM_GRAY, lineHeight: 1 }}>
              -10% per sempre + coupon ogni 3 consegne
            </Typography>
          </Box>
        </Stack>
        {!loading && totalConsec > 0 && (
          <Chip
            label={`Ciclo ${cycleNum} · ${posInCycle}/${CYCLE_LEN}`}
            size="small"
            sx={{ bgcolor: alpha(ORO, 0.1), color: ORO, fontWeight: 700, fontSize: "0.7rem", height: 24 }}
          />
        )}
      </Stack>

      {loading ? (
        <Skeleton height={100} variant="rounded" sx={{ flex: 1 }} />
      ) : (
        <>
          {/* timeline with arrows */}
          <Stack direction="row" alignItems="center" spacing={0.5} mb={2}>
            <IconButton
              size="small"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              sx={{ width: 28, height: 28, color: page === 0 ? "#ddd" : ORO, "&:hover": { bgcolor: alpha(ORO, 0.08) } }}
            >
              <Iconify icon="mdi:chevron-left" width={20} />
            </IconButton>

            <Box sx={{ flex: 1, position: "relative", px: 0.5 }}>
              <Box
                sx={{
                  position: "absolute",
                  top: 18, left: 20, right: 20, height: 2,
                  background: `linear-gradient(90deg, ${ORO} ${connectorPct}%, #eee ${connectorPct}%)`,
                  zIndex: 0,
                }}
              />
              <Stack direction="row" justifyContent="space-between" sx={{ position: "relative", zIndex: 1 }}>
                {visible.map((m) => (
                  <Stack key={m.month} alignItems="center" sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        width: 36, height: 36, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: "0.75rem", transition: "all 0.3s",
                        ...(m.completed
                          ? { bgcolor: ORO, color: "#fff", boxShadow: `0 2px 8px ${alpha(ORO, 0.35)}` }
                          : m.isCurrent
                          ? { bgcolor: "#fff", color: ORO, border: `2px solid ${ORO}`, boxShadow: `0 0 0 4px ${alpha(ORO, 0.12)}` }
                          : { bgcolor: "#f5f5f5", color: "#bbb" }),
                      }}
                    >
                      {m.completed ? <Iconify icon="mdi:check" width={18} /> : m.month}
                    </Box>
                    <Typography
                      sx={{
                        mt: 0.5, fontSize: "0.62rem",
                        fontWeight: m.isCoupon ? 700 : 500,
                        color: m.isCoupon && m.completed ? ORO : m.completed ? ORO : m.isCurrent ? ESPRESSO : "#bbb",
                        textAlign: "center", lineHeight: 1.2,
                      }}
                    >
                      {m.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>

            <IconButton
              size="small"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              sx={{ width: 28, height: 28, color: page >= totalPages - 1 ? "#ddd" : ORO, "&:hover": { bgcolor: alpha(ORO, 0.08) } }}
            >
              <Iconify icon="mdi:chevron-right" width={20} />
            </IconButton>
          </Stack>

          {/* page dots */}
          <Stack direction="row" justifyContent="center" spacing={0.5} mb={2}>
            {Array.from({ length: totalPages }, (_, i) => (
              <Box
                key={i}
                onClick={() => setPage(i)}
                sx={{
                  width: i === page ? 16 : 6, height: 6, borderRadius: 3,
                  bgcolor: i === page ? ORO : "#ddd",
                  transition: "all 0.3s", cursor: "pointer",
                }}
              />
            ))}
          </Stack>

          {/* savings */}
          <Box sx={{ bgcolor: alpha(ORO, 0.06), borderRadius: 2, p: 2, mb: 2, textAlign: "center" }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5} mb={0.5}>
              <Iconify icon="mdi:piggy-bank-outline" width={18} sx={{ color: ORO }} />
              <Typography sx={{ fontSize: "0.75rem", color: WARM_GRAY, fontWeight: 600 }}>
                Il tuo risparmio finora
              </Typography>
            </Stack>
            {totalConsec === 0 ? (
              <Typography sx={{ fontSize: "0.8rem", color: WARM_GRAY }}>
                Inizia il tuo abbonamento per risparmiare ogni mese!
              </Typography>
            ) : (
              <Stack direction="row" justifyContent="center" divider={<Typography sx={{ mx: 1, color: "#ddd" }}>+</Typography>}>
                {discountMonths > 0 && (
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: ESPRESSO, fontSize: "1.1rem" }}>
                      {discountMonths}x -10%
                    </Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: WARM_GRAY }}>consegne con sconto</Typography>
                  </Box>
                )}
                {couponValue > 0 && (
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: ORO, fontSize: "1.1rem" }}>
                      €{couponValue}
                    </Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: WARM_GRAY }}>in coupon regalo</Typography>
                  </Box>
                )}
              </Stack>
            )}
          </Box>
        </>
      )}

      <Box sx={{ mt: "auto" }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Iconify icon="mdi:cog-outline" />}
          sx={{
            borderColor: "#e0e0e0", color: ESPRESSO,
            "&:hover": { borderColor: ORO, bgcolor: alpha(ORO, 0.04) },
            fontWeight: 600, borderRadius: 2, py: 1.2, textTransform: "none",
          }}
        >
          Gestisci il mio abbonamento
        </Button>
      </Box>
    </Card>
  );
};

// ═══════════════════════════════════════════════
// COUPON
// ═══════════════════════════════════════════════
const CouponsSection = () => {
  const { data: coupons, loading } = useCoupons();

  if (loading) {
    return (
      <Grid container spacing={2}>
        {[0, 1, 2, 3].map((i) => (
          <Grid item xs={6} md={3} key={i}>
            <Skeleton variant="rounded" height={110} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!coupons?.length) {
    return (
      <Box sx={{ textAlign: "center", py: 5, bgcolor: "#fafafa", borderRadius: 3 }}>
        <Iconify icon="mdi:ticket-outline" width={36} sx={{ color: "#ddd", mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Nessun coupon attivo al momento
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {coupons.map((coupon, i) => (
        <Grid item xs={6} md={3} key={coupon.id || i}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "#fff",
              border: "1px solid #f0ece6",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* accent top */}
            <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, bgcolor: ORO }} />
            <Typography variant="caption" sx={{ color: WARM_GRAY, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.65rem" }}>
              {coupon.type || coupon.coupon_type || "Coupon"}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color: ORO, my: 0.5 }}>
              {coupon.amount ? `€${coupon.amount}` : coupon.discount ? `${coupon.discount}%` : "—"}
            </Typography>
            <Typography variant="caption" sx={{ color: "#aaa" }}>
              {coupon.expiry_date || coupon.expire_date || "Nessuna scadenza"}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// ═══════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════
const UserDashboard = () => {
  return (
    <Page title="Dashboard">
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4 }}>
        <HeroCard />

        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            <ThreeFFCard />
          </Grid>
          <Grid item xs={12} md={6}>
            <ROBCard />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Iconify icon="mdi:ticket-percent-outline" width={22} sx={{ color: ORO }} />
            <Typography variant="h6" fontWeight={700} color={ESPRESSO}>
              I Tuoi Premi
            </Typography>
          </Stack>
          <CouponsSection />
        </Box>
      </Box>
    </Page>
  );
};

export default UserDashboard;
