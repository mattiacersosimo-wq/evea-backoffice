import { Box, Card, Chip, Grid, Slider, Stack, Typography, Divider } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";
const SUCCESS = "#4A5C3A";

// ══════════════════════════════════════
// COMPENSATION PLAN CONSTANTS
// ══════════════════════════════════════
const DSB_PCT = { default: 0.15, starter: 0.30 };
const ISB_PCT = [0.04, 0.03, 0.03]; // L1, L2, L3
const RESIDUAL_PCT = [0.025, 0.025, 0.025, 0.015, 0.01, 0.01, 0.005, 0.005, 0.005];
const MVP_BONUS = 250;
const MVP_MENTOR = 25;
const THREE_FF_MAX = 81;
const ROB_DISCOUNT_PCT = 0.10;
const ROB_COUPON = 30;
const EVOLVING = { 5: 400, 6: 800, 7: 2000, 8: 5000, 9: 10000, 10: 15000, 11: 20000 };
const ROCK_SOLID = { 5: 200, 6: 400, 7: 1000, 8: 2000, 9: 4000, 10: 7500, 11: 10000 };
const AVG_BV_RATIO = 0.6; // BV ~ 60% of retail price

const cs = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

const SliderInput = ({ icon, label, value, onChange, min, max, step, unit, color }) => (
  <Box sx={{ mb: 2.5 }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
      <Stack direction="row" alignItems="center" spacing={0.8}>
        <Iconify icon={icon} width={18} sx={{ color: color || ORO }} />
        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: ESPRESSO }}>{label}</Typography>
      </Stack>
      <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: color || ORO }}>
        {unit === "€" ? `€${value}` : unit === "%" ? `${value}%` : value}
      </Typography>
    </Stack>
    <Slider
      value={value} onChange={(_, v) => onChange(v)}
      min={min} max={max} step={step || 1}
      sx={{
        color: color || ORO, height: 6,
        "& .MuiSlider-thumb": { width: 18, height: 18, bgcolor: "#fff", border: `2px solid ${color || ORO}` },
      }}
    />
  </Box>
);

const BonusRow = ({ icon, label, amount, color, subtitle }) => (
  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 1.2, borderBottom: "1px solid #f5f0e8" }}>
    <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(color, 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Iconify icon={icon} width={20} sx={{ color }} />
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: ESPRESSO }}>{label}</Typography>
      {subtitle && <Typography sx={{ fontSize: "0.65rem", color: MUTED }}>{subtitle}</Typography>}
    </Box>
    <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, color: amount > 0 ? color : "#ccc" }}>
      €{amount.toFixed(2)}
    </Typography>
  </Stack>
);

const SimulatorReport = () => {
  const { i18n } = useTranslation();
  const isIt = i18n.resolvedLanguage === "it";

  const [clients, setClients] = useState(5);
  const [avgOrder, setAvgOrder] = useState(27);
  const [smartshipPct, setSmartshipPct] = useState(60);
  const [promoters, setPromoters] = useState(2);
  const [promoterSales, setPromoterSales] = useState(200);
  const [hasStarterKit, setHasStarterKit] = useState(true);
  const [months, setMonths] = useState(6);

  const calc = useMemo(() => {
    const bvPerClient = avgOrder * AVG_BV_RATIO;
    const totalClientBV = clients * bvPerClient;
    const smartshipClients = Math.round(clients * smartshipPct / 100);
    const smartshipBV = smartshipClients * bvPerClient;

    // DSB
    const dsbPct = hasStarterKit ? DSB_PCT.starter : DSB_PCT.default;
    const dsb = totalClientBV * dsbPct;

    // ISB (from promoter team)
    const promoterBV = promoters * promoterSales * AVG_BV_RATIO;
    const isb = ISB_PCT.reduce((sum, pct) => sum + promoterBV * pct, 0);

    // 3FF
    const threeff = clients >= 3 ? Math.min(THREE_FF_MAX, clients * avgOrder * 0.33) : 0;

    // Go MVP (one-time, estimated per month)
    const totalDQV = clients * avgOrder;
    const goMvp = (hasStarterKit && totalDQV >= 1000 && clients >= 3) ? MVP_BONUS / 3 : 0; // amortized over ~3 months

    // MVP Mentor
    const mvpMentor = promoters > 0 ? MVP_MENTOR * Math.min(promoters, 3) : 0;

    // Residual (monthly, from smartship)
    const residual = RESIDUAL_PCT.slice(0, Math.min(3 + Math.floor(promoters / 2), 9))
      .reduce((sum, pct, i) => {
        if (i === 0) return sum + smartshipBV * pct;
        if (i < 3) return sum + (promoterBV * 0.3) * pct;
        return sum;
      }, 0);

    // ROB savings (personal)
    const robSavings = avgOrder * ROB_DISCOUNT_PCT;
    const robCoupon = ROB_COUPON / 3; // amortized monthly

    // Rock Solid MVP (monthly portion)
    const rockSolid = hasStarterKit ? (ROCK_SOLID[5] || 0) / 12 : 0;

    // Weekly bonuses
    const weeklyTotal = (dsb + isb + mvpMentor) * 4;
    // Monthly bonuses
    const monthlyTotal = residual + threeff + goMvp + rockSolid;
    const total = dsb + isb + residual + threeff + goMvp + mvpMentor + rockSolid + robSavings + robCoupon;

    // 12 month projection
    const projection = Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const growthFactor = 1 + (m * 0.05); // 5% growth per month
      const mClients = Math.round(clients * growthFactor);
      const mPromoters = Math.round(promoters * (1 + m * 0.08));
      const mTotal = total * growthFactor;
      return { month: m, total: mTotal, clients: mClients, promoters: mPromoters };
    });

    return {
      dsb, isb, residual, threeff, goMvp, mvpMentor, rockSolid, robSavings, robCoupon,
      total, weeklyTotal, monthlyTotal, projection,
      smartshipClients, totalClientBV, promoterBV,
    };
  }, [clients, avgOrder, smartshipPct, promoters, promoterSales, hasStarterKit, months]);

  const maxBar = Math.max(...calc.projection.map(p => p.total), 1);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* ── LEFT: Inputs ── */}
        <Grid item xs={12} md={5}>
          <Card sx={{ ...cs, p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
              <Iconify icon="mdi:tune-variant" width={22} sx={{ color: ORO }} />
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: ESPRESSO }}>
                {isIt ? "Configura il tuo scenario" : "Configure your scenario"}
              </Typography>
            </Stack>

            <SliderInput icon="mdi:account-group" label={isIt ? "Clienti personali" : "Personal clients"} value={clients} onChange={setClients} min={0} max={50} color="#2196F3" />
            <SliderInput icon="mdi:cart" label={isIt ? "Ordine medio (€)" : "Average order (€)"} value={avgOrder} onChange={setAvgOrder} min={20} max={100} step={1} unit="€" color="#FF9800" />
            <SliderInput icon="mdi:refresh" label={isIt ? "Clienti con Smartship" : "Smartship clients"} value={smartshipPct} onChange={setSmartshipPct} min={0} max={100} step={5} unit="%" color="#8BC34A" />

            <Divider sx={{ my: 2 }} />

            <SliderInput icon="mdi:account-tie" label={isIt ? "Promoter in 1ª linea" : "Direct promoters"} value={promoters} onChange={setPromoters} min={0} max={20} color={ORO} />
            <SliderInput icon="mdi:cash" label={isIt ? "Vendita media per promoter (€)" : "Avg promoter sales (€)"} value={promoterSales} onChange={setPromoterSales} min={50} max={1000} step={10} unit="€" color={SUCCESS} />

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={0.8}>
                <Iconify icon="mdi:package-variant" width={18} sx={{ color: ORO }} />
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: ESPRESSO }}>Starter Kit</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5}>
                {[true, false].map(v => (
                  <Chip
                    key={String(v)} label={v ? "Gold" : "No Kit"}
                    onClick={() => setHasStarterKit(v)}
                    sx={{
                      fontWeight: 700, cursor: "pointer",
                      bgcolor: hasStarterKit === v ? alpha(ORO, 0.15) : "#f5f5f5",
                      color: hasStarterKit === v ? ORO : MUTED,
                      border: hasStarterKit === v ? `1.5px solid ${ORO}` : "1.5px solid #eee",
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* ── RIGHT: Results ── */}
        <Grid item xs={12} md={7}>
          {/* Total card */}
          <Card sx={{ p: 3, mb: 2, borderRadius: 3, bgcolor: ESPRESSO, color: "#fff", position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", bgcolor: alpha(ORO, 0.08) }} />
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: alpha("#fff", 0.6), textTransform: "uppercase", letterSpacing: 1 }}>
              {isIt ? "Guadagno mensile stimato" : "Estimated monthly income"}
            </Typography>
            <Typography sx={{ fontSize: "2.8rem", fontWeight: 900, color: ORO, lineHeight: 1.1, mt: 0.5 }}>
              €{calc.total.toFixed(2)}
            </Typography>
            <Stack direction="row" spacing={2} mt={1.5}>
              <Box sx={{ bgcolor: alpha("#fff", 0.08), borderRadius: 1.5, px: 1.5, py: 0.8 }}>
                <Typography sx={{ fontSize: "0.6rem", color: alpha("#fff", 0.5) }}>{isIt ? "Settimanale" : "Weekly"}</Typography>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>€{(calc.total / 4).toFixed(2)}</Typography>
              </Box>
              <Box sx={{ bgcolor: alpha("#fff", 0.08), borderRadius: 1.5, px: 1.5, py: 0.8 }}>
                <Typography sx={{ fontSize: "0.6rem", color: alpha("#fff", 0.5) }}>{isIt ? "Annuale" : "Yearly"}</Typography>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>€{(calc.total * 12).toFixed(0)}</Typography>
              </Box>
              <Box sx={{ bgcolor: alpha("#fff", 0.08), borderRadius: 1.5, px: 1.5, py: 0.8 }}>
                <Typography sx={{ fontSize: "0.6rem", color: alpha("#fff", 0.5) }}>{isIt ? "Risparmio ROB" : "ROB savings"}</Typography>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>€{(calc.robSavings * 12 + calc.robCoupon * 12).toFixed(0)}/yr</Typography>
              </Box>
            </Stack>
          </Card>

          {/* Breakdown */}
          <Card sx={{ ...cs, p: 2.5, mb: 2 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO, mb: 1 }}>
              {isIt ? "Dettaglio Bonus" : "Bonus Breakdown"}
            </Typography>
            <BonusRow icon="mdi:account-cash" label="Direct Sales Bonus" amount={calc.dsb} color="#FF9800" subtitle={`${hasStarterKit ? "30%" : "15%"} of ${calc.totalClientBV.toFixed(0)} BV`} />
            <BonusRow icon="mdi:sitemap" label="Indirect Sales Bonus" amount={calc.isb} color="#00BCD4" subtitle={`4%+3%+3% of ${calc.promoterBV.toFixed(0)} BV`} />
            <BonusRow icon="mdi:chart-timeline-variant" label="Residual Bonus" amount={calc.residual} color="#607D8B" subtitle={`2.5% L1-L3 of ${calc.smartshipClients} smartship clients`} />
            <BonusRow icon="mdi:gift" label="3 For Free" amount={calc.threeff} color="#E91E63" subtitle={clients >= 3 ? `${clients} clients ≥ 3 ✓` : `Need 3+ clients (have ${clients})`} />
            <BonusRow icon="mdi:rocket-launch" label="Go MVP Bonus" amount={calc.goMvp} color="#4CAF50" subtitle={calc.goMvp > 0 ? "€250 one-time (amortized)" : "Need starter kit + DQV ≥ 1000"} />
            <BonusRow icon="mdi:account-group" label="MVP Mentor" amount={calc.mvpMentor} color="#9C27B0" subtitle={`€25 × ${Math.min(promoters, 3)} MVP promoters`} />
            <BonusRow icon="mdi:diamond-stone" label="Rock Solid MVP" amount={calc.rockSolid} color="#455A64" subtitle={hasStarterKit ? "€200/yr (monthly portion)" : "Need starter kit"} />
            <Box sx={{ borderTop: "2px solid #f0ece6", mt: 1, pt: 1 }}>
              <BonusRow icon="mdi:refresh-circle" label={isIt ? "Risparmio ROB" : "ROB Savings"} amount={calc.robSavings + calc.robCoupon} color="#8BC34A" subtitle="-10% + €30 coupon/3mo" />
            </Box>
          </Card>

          {/* 12 month projection */}
          <Card sx={{ ...cs, p: 2.5 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO, mb: 1.5 }}>
              {isIt ? "Proiezione 12 mesi (crescita 5%/mese)" : "12-month projection (5% monthly growth)"}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="flex-end" sx={{ height: 120 }}>
              {calc.projection.map((p) => (
                <Box key={p.month} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Typography sx={{ fontSize: "0.55rem", color: ORO, fontWeight: 700 }}>€{p.total.toFixed(0)}</Typography>
                  <Box sx={{
                    width: "100%", borderRadius: "3px 3px 0 0",
                    height: `${Math.max(4, (p.total / maxBar) * 100)}%`,
                    bgcolor: p.month <= 3 ? alpha(ORO, 0.4) : p.month <= 6 ? alpha(ORO, 0.6) : ORO,
                    transition: "height 0.5s",
                  }} />
                  <Typography sx={{ fontSize: "0.55rem", color: MUTED, mt: 0.2 }}>M{p.month}</Typography>
                </Box>
              ))}
            </Stack>
            <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: alpha(SUCCESS, 0.05), border: `1px solid ${alpha(SUCCESS, 0.15)}` }}>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: SUCCESS, textAlign: "center" }}>
                {isIt
                  ? `In 12 mesi potresti guadagnare €${calc.projection.reduce((s, p) => s + p.total, 0).toFixed(0)} + risparmio ROB €${((calc.robSavings + calc.robCoupon) * 12).toFixed(0)}`
                  : `In 12 months you could earn €${calc.projection.reduce((s, p) => s + p.total, 0).toFixed(0)} + ROB savings €${((calc.robSavings + calc.robCoupon) * 12).toFixed(0)}`
                }
              </Typography>
            </Box>
          </Card>

          {/* Motivational */}
          <Card sx={{ mt: 2, p: 2.5, borderRadius: 3, bgcolor: alpha(ORO, 0.04), border: `1.5px solid ${alpha(ORO, 0.2)}` }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Iconify icon="mdi:lightbulb-on" width={22} sx={{ color: ORO }} />
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO }}>
                {isIt ? "Lo sapevi?" : "Did you know?"}
              </Typography>
            </Stack>
            <Stack spacing={1}>
              <Typography sx={{ fontSize: "0.78rem", color: MUTED }}>
                {isIt
                  ? `• Con ${clients * 2} clienti guadagneresti €${(calc.total * 1.8).toFixed(0)}/mese (+${((calc.total * 1.8 - calc.total) / calc.total * 100).toFixed(0)}%)`
                  : `• With ${clients * 2} clients you'd earn €${(calc.total * 1.8).toFixed(0)}/mo (+${((calc.total * 1.8 - calc.total) / calc.total * 100).toFixed(0)}%)`
                }
              </Typography>
              <Typography sx={{ fontSize: "0.78rem", color: MUTED }}>
                {isIt
                  ? `• Ogni promoter che fai MVP ti porta €25 + attiva il bonus Indirect Sales`
                  : `• Every promoter who reaches MVP earns you €25 + activates Indirect Sales Bonus`
                }
              </Typography>
              <Typography sx={{ fontSize: "0.78rem", color: MUTED }}>
                {isIt
                  ? `• Lo smartship al ${smartshipPct}% genera €${calc.residual.toFixed(2)}/mese di residuo. Al 100% sarebbe €${(calc.residual / Math.max(smartshipPct, 1) * 100).toFixed(2)}/mese!`
                  : `• Smartship at ${smartshipPct}% generates €${calc.residual.toFixed(2)}/mo residual. At 100% it would be €${(calc.residual / Math.max(smartshipPct, 1) * 100).toFixed(2)}/mo!`
                }
              </Typography>
              {!hasStarterKit && (
                <Typography sx={{ fontSize: "0.78rem", color: "#E24B4A", fontWeight: 600 }}>
                  {isIt
                    ? "⚡ Con lo Starter Kit Gold il tuo DSB raddoppia dal 15% al 30%!"
                    : "⚡ With Gold Starter Kit your DSB doubles from 15% to 30%!"
                  }
                </Typography>
              )}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SimulatorReport;
