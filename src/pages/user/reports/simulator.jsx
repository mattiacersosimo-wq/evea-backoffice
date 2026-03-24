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
// FULL COMPENSATION PLAN
// ══════════════════════════════════════
const AVG_BV_RATIO = 0.6;

// Direct Sales: 15% default, 30% with starter kit
const DSB_PCT = { default: 0.15, starter: 0.30 };

// Indirect Sales: 4% L1, 3% L2, 3% L3
const ISB_PCT = [0.04, 0.03, 0.03];

// Residual: per level (unlocked by rank)
// Associate=L1-3, Platinum=L4, Sapphire=L5, Ruby=L6, Emerald=L7, Diamond=L8, BlueDiamond=L9
const RESIDUAL_PCT = [0.025, 0.025, 0.025, 0.015, 0.01, 0.01, 0.005, 0.005, 0.005];
const RESIDUAL_UNLOCK = [2, 2, 2, 5, 6, 7, 8, 9, 10]; // rank_id needed for each level

// Leadership: 2% gen1, 1% gen2 (rank 5+)
const LEADERSHIP_GEN1 = 0.02;
const LEADERSHIP_GEN2 = 0.01;

// Residual Matching: 20% L1, 10% L2 of residual bonus of your directs
const RESMATCHING_L1 = 0.20;
const RESMATCHING_L2 = 0.10;

// MVP
const MVP_BONUS = 250;
const MVP_MENTOR = 25;

// 3FF
const THREE_FF_MAX = 81;

// ROB
const ROB_DISCOUNT = 0.10;
const ROB_COUPON = 30;

// Evolving (one-time per rank, rank_id => amount)
const EVOLVING = { 5: 400, 6: 800, 7: 2000, 8: 5000, 9: 10000, 10: 15000, 11: 20000 };

// Rock Solid (monthly per rank, rank_id => amount)
const ROCK_SOLID = { 5: 200, 6: 400, 7: 1000, 8: 2000, 9: 4000, 10: 10000 };

// Rock Solid MVP (monthly if maintaining MVP requirements)
const RSP_MVP = { base: 100, powerup: 150 };

// Rank names
const RANKS = [
  { id: 1, name: "Associate" },
  { id: 2, name: "Starter Builder" },
  { id: 3, name: "Senior Builder" },
  { id: 4, name: "Platinum" },
  { id: 5, name: "Sapphire" },
  { id: 6, name: "Ruby" },
  { id: 7, name: "Emerald" },
  { id: 8, name: "Diamond" },
  { id: 9, name: "Blue Diamond" },
  { id: 10, name: "Crown Diamond" },
];

const cs = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

// ══════════════════════════════════════
// COMPONENTS
// ══════════════════════════════════════
const SliderInput = ({ icon, label, value, onChange, min, max, step, unit, color }) => (
  <Box sx={{ mb: 2 }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.3}>
      <Stack direction="row" alignItems="center" spacing={0.8}>
        <Iconify icon={icon} width={16} sx={{ color: color || ORO }} />
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: ESPRESSO }}>{label}</Typography>
      </Stack>
      <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: color || ORO }}>
        {unit === "€" ? `€${value}` : unit === "%" ? `${value}%` : value}
      </Typography>
    </Stack>
    <Slider value={value} onChange={(_, v) => onChange(v)} min={min} max={max} step={step || 1}
      sx={{ color: color || ORO, height: 5, "& .MuiSlider-thumb": { width: 16, height: 16, bgcolor: "#fff", border: `2px solid ${color || ORO}` } }} />
  </Box>
);

const BonusRow = ({ icon, label, amount, color, subtitle, highlight }) => (
  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 1, borderBottom: "1px solid #f5f0e8" }}>
    <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: alpha(color, 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Iconify icon={icon} width={18} sx={{ color }} />
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: ESPRESSO }}>{label}</Typography>
      {subtitle && <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>{subtitle}</Typography>}
    </Box>
    <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: amount > 0 ? (highlight ? SUCCESS : color) : "#ddd" }}>
      €{amount.toFixed(0)}
    </Typography>
  </Stack>
);

// ══════════════════════════════════════
// MAIN
// ══════════════════════════════════════
const SimulatorReport = () => {
  const { i18n } = useTranslation();
  const isIt = i18n.resolvedLanguage === "it";

  const [clients, setClients] = useState(5);
  const [avgOrder, setAvgOrder] = useState(27);
  const [smartshipPct, setSmartshipPct] = useState(60);
  const [promoters, setPromoters] = useState(2);
  const [promoterSales, setPromoterSales] = useState(200);
  const [rankId, setRankId] = useState(5);
  const [hasKit, setHasKit] = useState(true);
  const [hasMvp, setHasMvp] = useState(true);

  const calc = useMemo(() => {
    const bvClient = avgOrder * AVG_BV_RATIO;
    const totalClientBV = clients * bvClient;
    const smartshipClients = Math.round(clients * smartshipPct / 100);
    const smartshipBV = smartshipClients * bvClient;
    const promoterBV = promoters * promoterSales * AVG_BV_RATIO;

    // 1. Direct Sales Bonus
    const dsbPct = hasKit ? DSB_PCT.starter : DSB_PCT.default;
    const dsb = totalClientBV * dsbPct;

    // 2. Indirect Sales Bonus (from promoter team L1-L3)
    const isb = ISB_PCT.reduce((s, pct) => s + promoterBV * pct, 0);

    // 3. 3 For Free
    const threeff = clients >= 3 ? Math.min(THREE_FF_MAX, avgOrder * 3 * 0.33) : 0;

    // 4. Go MVP (one-time, amortized /3 months)
    const totalDQV = clients * avgOrder;
    const goMvp = (hasKit && hasMvp && totalDQV >= 1000 && clients >= 3) ? Math.round(MVP_BONUS / 3) : 0;

    // 5. Rock Solid MVP (monthly if maintaining MVP)
    const rspMvp = (hasKit && hasMvp) ? RSP_MVP.base + RSP_MVP.powerup : 0;

    // 6. MVP Mentor (€25 per direct MVP promoter)
    const mvpMentor = hasMvp ? MVP_MENTOR * Math.min(promoters, 5) : 0;

    // 7. Residual Bonus (from smartship, levels unlocked by rank)
    const unlockedLevels = RESIDUAL_UNLOCK.filter(r => r <= rankId).length;
    let residual = 0;
    for (let i = 0; i < unlockedLevels; i++) {
      if (i === 0) residual += smartshipBV * RESIDUAL_PCT[i];
      else if (i < 3) residual += (promoterBV * 0.4) * RESIDUAL_PCT[i];
      else residual += (promoterBV * 0.2) * RESIDUAL_PCT[i];
    }

    // 8. Leadership Bonus (rank 5+, 2% gen1 + 1% gen2)
    const leadership = rankId >= 5 ? (promoterBV * LEADERSHIP_GEN1) + (promoterBV * 0.5 * LEADERSHIP_GEN2) : 0;

    // 9. Residual Matching (20% L1 + 10% L2 of your directs' residual)
    const directResidual = promoters * smartshipBV * 0.025 * 0.5;
    const resMatching = directResidual * RESMATCHING_L1 + directResidual * 0.5 * RESMATCHING_L2;

    // 10. Evolving Bonus (ONE-TIME per rank achievement — shown separately)
    const evolvingOneTime = EVOLVING[rankId] || 0;

    // 11. Rock Solid Bonus (MONTHLY per rank — paid every month)
    const rockSolid = ROCK_SOLID[rankId] || 0;

    // 12. ROB savings
    const robSavings = avgOrder * ROB_DISCOUNT;
    const robCoupon = ROB_COUPON / 3;

    const weeklyBonuses = dsb + isb + mvpMentor;
    const monthlyBonuses = residual + threeff + leadership + resMatching + rockSolid + rspMvp;
    const oneTimeBonuses = goMvp + evolvingOneTime;
    const total = weeklyBonuses + monthlyBonuses;
    const totalWithSavings = total + robSavings + robCoupon;

    // Projection
    const projection = Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const g = 1 + (m * 0.05);
      return { month: m, total: Math.round(total * g), cumulative: 0 };
    });
    let cum = 0;
    projection.forEach(p => { cum += p.total; p.cumulative = cum; });

    return {
      dsb, isb, threeff, goMvp, rspMvp, mvpMentor, residual, leadership, resMatching, evolvingOneTime, rockSolid,
      robSavings, robCoupon, total, totalWithSavings, weeklyBonuses, monthlyBonuses,
      projection, smartshipClients, totalClientBV, promoterBV, unlockedLevels,
    };
  }, [clients, avgOrder, smartshipPct, promoters, promoterSales, rankId, hasKit, hasMvp]);

  const maxBar = Math.max(...calc.projection.map(p => p.total), 1);
  const currentRank = RANKS.find(r => r.id === rankId) || RANKS[0];

  return (
    <Box>
      <Grid container spacing={2.5}>
        {/* ── LEFT: Inputs ── */}
        <Grid item xs={12} md={4}>
          <Card sx={{ ...cs, p: 2.5, position: "sticky", top: 80 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Iconify icon="mdi:tune-variant" width={20} sx={{ color: ORO }} />
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>
                {isIt ? "Il tuo scenario" : "Your scenario"}
              </Typography>
            </Stack>

            <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", mb: 1 }}>
              {isIt ? "Clienti" : "Clients"}
            </Typography>
            <SliderInput icon="mdi:account-group" label={isIt ? "N° clienti" : "Clients"} value={clients} onChange={setClients} min={0} max={50} color="#2196F3" />
            <SliderInput icon="mdi:cart" label={isIt ? "Ordine medio" : "Avg order"} value={avgOrder} onChange={setAvgOrder} min={20} max={100} unit="€" color="#FF9800" />
            <SliderInput icon="mdi:refresh" label="Smartship %" value={smartshipPct} onChange={setSmartshipPct} min={0} max={100} step={5} unit="%" color="#8BC34A" />

            <Divider sx={{ my: 1.5 }} />
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", mb: 1 }}>
              Team
            </Typography>
            <SliderInput icon="mdi:account-tie" label={isIt ? "Promoter diretti" : "Direct promoters"} value={promoters} onChange={setPromoters} min={0} max={20} color={ORO} />
            <SliderInput icon="mdi:cash" label={isIt ? "Vendite/promoter" : "Sales/promoter"} value={promoterSales} onChange={setPromoterSales} min={50} max={1000} step={10} unit="€" color={SUCCESS} />

            <Divider sx={{ my: 1.5 }} />
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", mb: 1 }}>
              Status
            </Typography>

            {/* Rank selector */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: ESPRESSO }}>
                <Iconify icon="mdi:trophy" width={16} sx={{ mr: 0.5, verticalAlign: "middle", color: ORO }} />
                Rank
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: ORO }}>{currentRank.name}</Typography>
            </Stack>
            <Slider value={rankId} onChange={(_, v) => setRankId(v)} min={1} max={10} step={1}
              marks={RANKS.map(r => ({ value: r.id, label: "" }))}
              sx={{ color: ORO, height: 5, mb: 2, "& .MuiSlider-thumb": { width: 16, height: 16, bgcolor: "#fff", border: `2px solid ${ORO}` } }} />

            <Stack direction="row" spacing={1} mb={1}>
              {[{ v: hasKit, set: setHasKit, label: "Starter Kit" }, { v: hasMvp, set: setHasMvp, label: "MVP" }].map(({ v, set, label }) => (
                <Chip key={label} label={`${label}: ${v ? "✓" : "✗"}`} onClick={() => set(!v)}
                  sx={{ flex: 1, cursor: "pointer", fontWeight: 700, fontSize: "0.7rem",
                    bgcolor: v ? alpha(SUCCESS, 0.1) : "#f5f5f5", color: v ? SUCCESS : MUTED,
                    border: `1.5px solid ${v ? SUCCESS : "#eee"}` }} />
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* ── RIGHT: Results ── */}
        <Grid item xs={12} md={8}>
          {/* Total */}
          <Card sx={{ p: 3, mb: 2, borderRadius: 3, bgcolor: ESPRESSO, position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", bgcolor: alpha(ORO, 0.06) }} />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: alpha("#fff", 0.5), textTransform: "uppercase", letterSpacing: 1 }}>
                  {isIt ? "Guadagno mensile stimato" : "Estimated monthly income"}
                </Typography>
                <Typography sx={{ fontSize: "2.5rem", fontWeight: 900, color: ORO, lineHeight: 1.1, mt: 0.3 }}>
                  €{calc.total.toLocaleString()}
                </Typography>
                {calc.oneTimeBonuses > 0 && (
                  <Typography sx={{ fontSize: "0.75rem", color: "#FF5722", fontWeight: 700, mt: 0.3 }}>
                    + €{calc.oneTimeBonuses.toLocaleString()} one-time (Evolving{calc.goMvp > 0 ? " + MVP" : ""})
                  </Typography>
                )}
                <Typography sx={{ fontSize: "0.65rem", color: alpha("#fff", 0.4), mt: 0.3 }}>
                  + €{(calc.robSavings + calc.robCoupon).toFixed(0)}/mo ROB savings
                </Typography>
              </Grid>
              <Grid item xs={12} md={7}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {[
                    { l: isIt ? "Settimanale" : "Weekly", v: `€${(calc.weeklyBonuses * 4).toFixed(0)}` },
                    { l: isIt ? "Mensile" : "Monthly", v: `€${calc.monthlyBonuses.toFixed(0)}` },
                    { l: isIt ? "Annuale" : "Yearly", v: `€${(calc.total * 12).toFixed(0)}` },
                    { l: "Rank", v: currentRank.name },
                    { l: isIt ? "Livelli Residual" : "Residual Levels", v: `${calc.unlockedLevels}/9` },
                  ].map(b => (
                    <Box key={b.l} sx={{ bgcolor: alpha("#fff", 0.06), borderRadius: 1.5, px: 1.5, py: 0.6, flex: "1 1 0", minWidth: 80 }}>
                      <Typography sx={{ fontSize: "0.55rem", color: alpha("#fff", 0.4) }}>{b.l}</Typography>
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>{b.v}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Card>

          {/* Breakdown */}
          <Card sx={{ ...cs, p: 2.5, mb: 2 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO, mb: 1 }}>
              {isIt ? "Tutti i Bonus" : "All Bonuses"}
            </Typography>

            <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: "#4CAF50", textTransform: "uppercase", mt: 1, mb: 0.5 }}>
              {isIt ? "Bonus Settimanali" : "Weekly Bonuses"}
            </Typography>
            <BonusRow icon="mdi:account-cash" label="Direct Sales" amount={calc.dsb} color="#FF9800" subtitle={`${hasKit ? "30%" : "15%"} × ${calc.totalClientBV.toFixed(0)} BV`} />
            <BonusRow icon="mdi:sitemap" label="Indirect Sales" amount={calc.isb} color="#00BCD4" subtitle={`L1: 4%, L2: 3%, L3: 3% × ${calc.promoterBV.toFixed(0)} BV`} />
            <BonusRow icon="mdi:account-group" label="MVP Mentor" amount={calc.mvpMentor} color="#9C27B0" subtitle={`€25 × ${Math.min(promoters, 5)} promoter MVP`} />

            <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: ORO, textTransform: "uppercase", mt: 2, mb: 0.5 }}>
              {isIt ? "Bonus Mensili" : "Monthly Bonuses"}
            </Typography>
            <BonusRow icon="mdi:chart-timeline-variant" label="Residual" amount={calc.residual} color="#607D8B" subtitle={`${calc.unlockedLevels} levels unlocked (rank ${currentRank.name})`} />
            <BonusRow icon="mdi:crown" label="Leadership" amount={calc.leadership} color={ORO} subtitle={rankId >= 5 ? "2% Gen1 + 1% Gen2" : `Unlock at Sapphire (rank 5)`} />
            <BonusRow icon="mdi:swap-horizontal" label="Residual Matching" amount={calc.resMatching} color="#795548" subtitle="20% L1 + 10% L2 of team residual" />
            <BonusRow icon="mdi:gift" label="3 For Free" amount={calc.threeff} color="#E91E63" subtitle={clients >= 3 ? `${clients} clients ≥ 3 ✓` : `Need 3+ clients`} />
            <BonusRow icon="mdi:shield-star" label="Rock Solid MVP" amount={calc.rspMvp} color="#2196F3" subtitle={hasMvp ? "€100 base + €150 power-up" : "Requires MVP"} />
            <BonusRow icon="mdi:diamond-stone" label="Rock Solid Bonus" amount={calc.rockSolid} color="#455A64" subtitle={ROCK_SOLID[rankId] ? `€${ROCK_SOLID[rankId].toLocaleString()}/month for ${currentRank.name}` : "Unlock at Sapphire"} />

            <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: "#4CAF50", textTransform: "uppercase", mt: 2, mb: 0.5 }}>
              {isIt ? "Una Tantum" : "One-Time"}
            </Typography>
            <BonusRow icon="mdi:rocket-launch" label="Go MVP" amount={MVP_BONUS} color="#4CAF50" subtitle={hasMvp && hasKit ? "€250 one-time ✓" : "Need kit + DQV≥1000 + 3 clients"} />
            <BonusRow icon="mdi:trending-up" label="Evolving Bonus" amount={calc.evolvingOneTime} color="#FF5722" subtitle={calc.evolvingOneTime > 0 ? `€${calc.evolvingOneTime.toLocaleString()} one-time for ${currentRank.name}` : "Unlock at Sapphire"} />

            <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "2px solid #f0ece6" }}>
              <BonusRow icon="mdi:refresh-circle" label="ROB Savings" amount={calc.robSavings + calc.robCoupon} color="#8BC34A" subtitle="-10% + €30 coupon/3mo" highlight />
            </Box>
          </Card>

          {/* Chart */}
          <Card sx={{ ...cs, p: 2.5, mb: 2 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO, mb: 2 }}>
              {isIt ? "Proiezione 12 mesi (+5%/mese)" : "12-month projection (+5%/mo)"}
            </Typography>
            <Box sx={{ height: 180, display: "flex", alignItems: "flex-end", gap: "6px", px: 1 }}>
              {calc.projection.map((p) => {
                const h = Math.max(8, (p.total / maxBar) * 100);
                return (
                  <Box key={p.month} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography sx={{ fontSize: "0.6rem", color: ORO, fontWeight: 700, mb: 0.3 }}>€{p.total}</Typography>
                    <Box sx={{
                      width: "100%", borderRadius: "4px 4px 0 0", transition: "height 0.5s",
                      height: `${h}%`, minHeight: 8,
                      background: `linear-gradient(180deg, ${ORO} 0%, ${alpha(ORO, 0.4)} 100%)`,
                    }} />
                    <Typography sx={{ fontSize: "0.6rem", color: MUTED, mt: 0.3, fontWeight: 600 }}>M{p.month}</Typography>
                  </Box>
                );
              })}
            </Box>
            <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: alpha(SUCCESS, 0.05), border: `1px solid ${alpha(SUCCESS, 0.15)}`, textAlign: "center" }}>
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: SUCCESS }}>
                {isIt ? "In 12 mesi:" : "In 12 months:"}
                {" "}€{calc.projection[calc.projection.length - 1].cumulative.toLocaleString()}
                {" "}+ €{((calc.robSavings + calc.robCoupon) * 12).toFixed(0)} ROB
              </Typography>
            </Box>
          </Card>

          {/* Motivation */}
          <Card sx={{ p: 2.5, borderRadius: 3, bgcolor: alpha(ORO, 0.04), border: `1.5px solid ${alpha(ORO, 0.2)}` }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
              <Iconify icon="mdi:lightbulb-on" width={22} sx={{ color: ORO }} />
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ESPRESSO }}>
                {isIt ? "Come crescere più velocemente" : "How to grow faster"}
              </Typography>
            </Stack>
            <Stack spacing={1}>
              {clients < 10 && (
                <Typography sx={{ fontSize: "0.78rem", color: MUTED }}>
                  🎯 {isIt
                    ? `Con 10 clienti guadagneresti €${(calc.total * (10 / Math.max(clients, 1))).toFixed(0)}/mese — raddoppia i tuoi clienti!`
                    : `With 10 clients you'd earn €${(calc.total * (10 / Math.max(clients, 1))).toFixed(0)}/mo — double your clients!`}
                </Typography>
              )}
              {smartshipPct < 80 && (
                <Typography sx={{ fontSize: "0.78rem", color: MUTED }}>
                  🔄 {isIt
                    ? `Porta lo smartship all'80%: il residual passa da €${calc.residual.toFixed(0)} a €${(calc.residual * (80 / Math.max(smartshipPct, 1))).toFixed(0)}/mese`
                    : `Push smartship to 80%: residual goes from €${calc.residual.toFixed(0)} to €${(calc.residual * (80 / Math.max(smartshipPct, 1))).toFixed(0)}/mo`}
                </Typography>
              )}
              {rankId < 5 && (
                <Typography sx={{ fontSize: "0.78rem", color: MUTED }}>
                  👑 {isIt
                    ? `Al rank Sapphire sblocchi Leadership (€${(calc.promoterBV * 0.02).toFixed(0)}/mo), Evolving (€400 una tantum), e Rock Solid (€200/mo)`
                    : `At Sapphire rank you unlock Leadership (€${(calc.promoterBV * 0.02).toFixed(0)}/mo), Evolving (€400 one-time), and Rock Solid (€200/mo)`}
                </Typography>
              )}
              {!hasKit && (
                <Typography sx={{ fontSize: "0.78rem", color: "#E24B4A", fontWeight: 600 }}>
                  ⚡ {isIt ? "Con lo Starter Kit il DSB raddoppia dal 15% al 30%!" : "With Starter Kit DSB doubles from 15% to 30%!"}
                </Typography>
              )}
              {promoters < 3 && (
                <Typography sx={{ fontSize: "0.78rem", color: MUTED }}>
                  🤝 {isIt
                    ? `Con 3 promoter il tuo Indirect Sales e Residual Matching crescono esponenzialmente`
                    : `With 3 promoters your Indirect Sales and Residual Matching grow exponentially`}
                </Typography>
              )}
              {rankId >= 5 && (
                <Typography sx={{ fontSize: "0.78rem", color: SUCCESS, fontWeight: 600 }}>
                  🏆 {isIt
                    ? `Complimenti! Al rank ${currentRank.name} sblocchi ${calc.unlockedLevels} livelli di residual + Leadership + Evolving €${EVOLVING[rankId] || 0}`
                    : `Congrats! At ${currentRank.name} you unlock ${calc.unlockedLevels} residual levels + Leadership + Evolving €${EVOLVING[rankId] || 0}`}
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
