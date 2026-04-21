import { Box, Card, Chip, Grid, Slider, Stack, Typography, Divider } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";
const SUCCESS = "#4A5C3A";

// ══════════════════════════════════════
// COMPENSATION PLAN
// ══════════════════════════════════════
const AVG_BV_RATIO = 0.6;
const DSB_PCT = { default: 0.15, starter: 0.30 };
const ISB_PCT = [0.04, 0.03, 0.03];
const RESIDUAL_PCT = [0.025, 0.025, 0.025, 0.015, 0.01, 0.01, 0.005, 0.005, 0.005];
const RESIDUAL_UNLOCK = [2, 2, 2, 5, 6, 7, 8, 9, 10];
const LEADERSHIP_GEN1 = 0.02;
const LEADERSHIP_GEN2 = 0.01;
const RESMATCHING_L1 = 0.20;
const RESMATCHING_L2 = 0.10;
const MVP_BONUS = 250;
const MVP_MENTOR = 25;
// Fast Start Bonus: Bronze €15, Silver €30, Gold €60 (pagato sullo starter pack)
const FAST_START = { bronze: 15, silver: 30, gold: 60 };
// Assumiamo mix kit: 10% bronze, 20% silver, 70% gold (split realistico)
const FAST_START_AVG = FAST_START.bronze * 0.1 + FAST_START.silver * 0.2 + FAST_START.gold * 0.7; // = €49.50
const THREE_FF_MAX = 81;
const ROB_DISCOUNT = 0.10;
const ROB_COUPON = 30;
const RSP_MVP = { base: 100, powerup: 150 };
const EVOLVING = { 4: 400, 5: 800, 6: 2000, 7: 5000, 8: 10000, 9: 15000, 10: 20000 };
const ROCK_SOLID = { 4: 200, 5: 400, 6: 1000, 7: 2000, 8: 4000, 9: 7500, 10: 10000 };

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

// Preset realistici per rank con duplicazione
const RANK_PRESETS = {
  1: { clients: 2, avgOrder: 27, smartship: 30, promoters: 0, clientsPerPromoter: 3, promotersPerPromoter: 0, dupLevels: 0, dupDecay: 0 },
  2: { clients: 5, avgOrder: 27, smartship: 50, promoters: 2, clientsPerPromoter: 3, promotersPerPromoter: 1, dupLevels: 1, dupDecay: 0.7 },
  3: { clients: 8, avgOrder: 30, smartship: 55, promoters: 3, clientsPerPromoter: 4, promotersPerPromoter: 2, dupLevels: 2, dupDecay: 0.7 },
  4: { clients: 10, avgOrder: 30, smartship: 60, promoters: 5, clientsPerPromoter: 4, promotersPerPromoter: 2, dupLevels: 3, dupDecay: 0.65 },
  5: { clients: 12, avgOrder: 35, smartship: 65, promoters: 7, clientsPerPromoter: 5, promotersPerPromoter: 3, dupLevels: 4, dupDecay: 0.6 },
  6: { clients: 15, avgOrder: 35, smartship: 70, promoters: 10, clientsPerPromoter: 5, promotersPerPromoter: 3, dupLevels: 5, dupDecay: 0.6 },
  7: { clients: 18, avgOrder: 40, smartship: 75, promoters: 12, clientsPerPromoter: 5, promotersPerPromoter: 3, dupLevels: 6, dupDecay: 0.55 },
  8: { clients: 20, avgOrder: 40, smartship: 80, promoters: 15, clientsPerPromoter: 6, promotersPerPromoter: 4, dupLevels: 7, dupDecay: 0.55 },
  9: { clients: 25, avgOrder: 45, smartship: 85, promoters: 18, clientsPerPromoter: 6, promotersPerPromoter: 4, dupLevels: 8, dupDecay: 0.5 },
  10: { clients: 30, avgOrder: 50, smartship: 90, promoters: 20, clientsPerPromoter: 7, promotersPerPromoter: 5, dupLevels: 9, dupDecay: 0.5 },
};

const cs = { bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0ece6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

const SliderInput = ({ icon, label, value, onChange, min, max, step, unit, color }) => (
  <Box sx={{ mb: 1.5 }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.2}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Iconify icon={icon} width={14} sx={{ color: color || ORO }} />
        <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: ESPRESSO }}>{label}</Typography>
      </Stack>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: color || ORO }}>
        {unit === "€" ? `€${value}` : unit === "%" ? `${value}%` : value}
      </Typography>
    </Stack>
    <Slider value={value} onChange={(_, v) => onChange(v)} min={min} max={max} step={step || 1}
      sx={{ color: color || ORO, height: 4, "& .MuiSlider-thumb": { width: 14, height: 14, bgcolor: "#fff", border: `2px solid ${color || ORO}` } }} />
  </Box>
);

const BonusRow = ({ icon, label, amount, color, subtitle }) => (
  <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 0.8, borderBottom: "1px solid #f5f0e8" }}>
    <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: alpha(color, 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Iconify icon={icon} width={16} sx={{ color }} />
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: ESPRESSO }}>{label}</Typography>
      {subtitle && <Typography sx={{ fontSize: "0.55rem", color: MUTED }}>{subtitle}</Typography>}
    </Box>
    <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: amount > 0 ? color : "#ddd" }}>
      €{amount.toLocaleString("it-IT", { maximumFractionDigits: 0 })}
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
  const [clientsPerPromoter, setClientsPerPromoter] = useState(3);
  const [promotersPerPromoter, setPromotersPerPromoter] = useState(1);
  const [dupLevels, setDupLevels] = useState(2);
  const [dupDecay] = useState(100);
  const [rankId, setRankId] = useState(5);
  const [hasKit, setHasKit] = useState(true);
  const [hasMvp, setHasMvp] = useState(true);

  const applyPreset = useCallback((rid) => {
    const p = RANK_PRESETS[rid];
    if (!p) return;
    setClients(p.clients);
    setAvgOrder(p.avgOrder);
    setSmartshipPct(p.smartship);
    setPromoters(p.promoters);
    setClientsPerPromoter(p.clientsPerPromoter);
    setPromotersPerPromoter(p.promotersPerPromoter);
    setDupLevels(p.dupLevels);
    // decay fixed at 100%
    setRankId(rid);
    setHasKit(rid >= 2);
    setHasMvp(rid >= 2);
  }, []);

  const calc = useMemo(() => {
    const bvClient = avgOrder * AVG_BV_RATIO;
    const smartshipClients = Math.round(clients * smartshipPct / 100);
    const smartshipBV = smartshipClients * bvClient;
    const decay = dupDecay / 100;

    // Build team tree per level
    const levels = [{ promoters: promoters, clientsEach: clientsPerPromoter }];
    for (let i = 1; i < Math.min(dupLevels, 9); i++) {
      const prev = levels[i - 1];
      const p = Math.round(prev.promoters * promotersPerPromoter * Math.pow(decay, i));
      const c = Math.max(1, Math.round(clientsPerPromoter * Math.pow(decay, i)));
      levels.push({ promoters: Math.min(p, 5000), clientsEach: c });
    }

    const totalTeamPromoters = levels.reduce((s, l) => s + l.promoters, 0);
    const totalTeamClients = levels.reduce((s, l) => s + l.promoters * l.clientsEach, 0);
    const totalTeamBV = levels.reduce((s, l) => s + l.promoters * l.clientsEach * bvClient, 0);
    const totalClientBV = clients * bvClient;

    // 1. DSB (personal clients only)
    const dsb = totalClientBV * (hasKit ? DSB_PCT.starter : DSB_PCT.default);

    // 2. ISB (L1-L3 BV)
    let isb = 0;
    for (let i = 0; i < Math.min(3, levels.length); i++) {
      const lvlBV = levels[i].promoters * levels[i].clientsEach * bvClient;
      isb += lvlBV * ISB_PCT[i];
    }

    // 3. 3FF
    const threeff = clients >= 3 ? Math.min(THREE_FF_MAX, avgOrder * 3 * 0.33) : 0;

    // 4. Go MVP
    const goMvp = (hasKit && hasMvp) ? MVP_BONUS : 0;

    // 5. RSP MVP
    const rspMvp = (hasKit && hasMvp) ? RSP_MVP.base + RSP_MVP.powerup : 0;

    // 6. MVP Mentor
    const mvpMentor = hasMvp ? MVP_MENTOR * Math.min(promoters, 10) : 0;

    // 6b. Fast Start Bonus (one-time on each new promoter that buys a starter kit)
    const fastStart = promoters * FAST_START_AVG;

    // 7. Residual Bonus (smartship BV per level)
    const unlockedLevels = RESIDUAL_UNLOCK.filter(r => r <= rankId).length;
    let residual = 0;
    // Level 0 = personal smartship clients
    residual += smartshipBV * RESIDUAL_PCT[0];
    for (let i = 1; i < Math.min(unlockedLevels, levels.length + 1); i++) {
      const lvlIdx = i - 1;
      if (lvlIdx < levels.length) {
        const lvlSmartshipBV = levels[lvlIdx].promoters * levels[lvlIdx].clientsEach * bvClient * (smartshipPct / 100);
        residual += lvlSmartshipBV * (RESIDUAL_PCT[i] || 0);
      }
    }

    // 8. Leadership (rank 5+, 2% gen1 BV + 1% gen2 BV)
    const gen1BV = levels[0] ? levels[0].promoters * levels[0].clientsEach * bvClient : 0;
    const gen2BV = levels[1] ? levels[1].promoters * levels[1].clientsEach * bvClient : 0;
    const leadership = rankId >= 5 ? gen1BV * LEADERSHIP_GEN1 + gen2BV * LEADERSHIP_GEN2 : 0;

    // 9. Residual Matching (20% L1 + 10% L2 of directs' residual earnings)
    const directsResidualEarning = levels[0] ? levels[0].promoters * (levels[0].clientsEach * bvClient * smartshipPct / 100 * 0.025) : 0;
    const l2ResidualEarning = levels[1] ? levels[1].promoters * (levels[1].clientsEach * bvClient * smartshipPct / 100 * 0.025) * 0.5 : 0;
    const resMatching = directsResidualEarning * RESMATCHING_L1 + l2ResidualEarning * RESMATCHING_L2;

    // 10. Evolving (one-time)
    const evolvingOneTime = EVOLVING[rankId] || 0;

    // 11. Rock Solid (monthly)
    const rockSolid = ROCK_SOLID[rankId] || 0;

    // 12. ROB
    const robSavings = avgOrder * ROB_DISCOUNT + ROB_COUPON / 3;

    const monthlyRecurring = dsb + isb + residual + threeff + leadership + resMatching + rockSolid + rspMvp + mvpMentor;
    const oneTime = goMvp + evolvingOneTime;

    // Projection 12 months
    const projection = Array.from({ length: 12 }, (_, i) => {
      const g = 1 + (i * 0.05);
      return { month: i + 1, total: Math.round(monthlyRecurring * g) };
    });
    let cum = 0;
    projection.forEach(p => { cum += p.total; p.cumulative = cum; });

    return {
      dsb, isb, threeff, goMvp, rspMvp, mvpMentor, fastStart, residual, leadership, resMatching,
      evolvingOneTime, rockSolid, robSavings, monthlyRecurring, oneTime, projection,
      totalClientBV, totalTeamBV, totalTeamPromoters, totalTeamClients, levels,
      smartshipClients, unlockedLevels,
    };
  }, [clients, avgOrder, smartshipPct, promoters, clientsPerPromoter, promotersPerPromoter, dupLevels, dupDecay, rankId, hasKit, hasMvp]);

  const maxBar = Math.max(...calc.projection.map(p => p.total), 1);
  const currentRank = RANKS.find(r => r.id === rankId) || RANKS[0];

  return (
    <Box>
      <Grid container spacing={2}>
        {/* ── LEFT: Inputs ── */}
        <Grid item xs={12} md={4}>
          <Card sx={{ ...cs, p: 2, position: "sticky", top: 80 }}>
            {/* Rank selector with preset */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: ESPRESSO }}>
                <Iconify icon="mdi:trophy" width={16} sx={{ mr: 0.5, verticalAlign: "middle", color: ORO }} />
                {currentRank.name}
              </Typography>
              <Chip label={isIt ? "Applica preset" : "Apply preset"} size="small" onClick={() => applyPreset(rankId)}
                sx={{ cursor: "pointer", fontWeight: 700, fontSize: "0.6rem", bgcolor: alpha(ORO, 0.1), color: ORO }} />
            </Stack>
            <Slider value={rankId} onChange={(_, v) => setRankId(v)} min={1} max={10}
              marks={RANKS.map(r => ({ value: r.id }))}
              sx={{ color: ORO, height: 4, mb: 1, "& .MuiSlider-thumb": { width: 14, height: 14, bgcolor: "#fff", border: `2px solid ${ORO}` } }} />

            <Stack direction="row" spacing={0.5} mb={1.5}>
              {[{ v: hasKit, set: setHasKit, l: "Kit" }, { v: hasMvp, set: setHasMvp, l: "MVP" }].map(({ v, set, l }) => (
                <Chip key={l} label={`${l} ${v ? "✓" : "✗"}`} size="small" onClick={() => set(!v)}
                  sx={{ flex: 1, cursor: "pointer", fontWeight: 700, fontSize: "0.65rem",
                    bgcolor: v ? alpha(SUCCESS, 0.1) : "#f5f5f5", color: v ? SUCCESS : MUTED, border: `1px solid ${v ? SUCCESS : "#eee"}` }} />
              ))}
            </Stack>

            <Divider sx={{ my: 1 }} />
            <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", mb: 0.5 }}>
              {isIt ? "I tuoi clienti" : "Your clients"}
            </Typography>
            <SliderInput icon="mdi:account-group" label={isIt ? "Clienti" : "Clients"} value={clients} onChange={setClients} min={0} max={50} color="#2196F3" />
            <SliderInput icon="mdi:cart" label={isIt ? "Ordine medio" : "Avg order"} value={avgOrder} onChange={setAvgOrder} min={20} max={100} unit="€" color="#FF9800" />
            <SliderInput icon="mdi:refresh" label="Smartship" value={smartshipPct} onChange={setSmartshipPct} min={0} max={100} step={5} unit="%" color="#8BC34A" />

            <Divider sx={{ my: 1 }} />
            <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", mb: 0.5 }}>
              {isIt ? "Duplicazione team" : "Team duplication"}
            </Typography>
            <SliderInput icon="mdi:account-tie" label={isIt ? "Promoter diretti" : "Direct promoters"} value={promoters} onChange={setPromoters} min={0} max={30} color={ORO} />
            <SliderInput icon="mdi:account-multiple-plus" label={isIt ? "Clienti per promoter" : "Clients/promoter"} value={clientsPerPromoter} onChange={setClientsPerPromoter} min={1} max={15} color="#00BCD4" />
            <SliderInput icon="mdi:account-switch" label={isIt ? "Promoter per promoter" : "Promoters/promoter"} value={promotersPerPromoter} onChange={setPromotersPerPromoter} min={0} max={8} color="#9C27B0" />
            <SliderInput icon="mdi:layers" label={isIt ? "Livelli profondità" : "Depth levels"} value={dupLevels} onChange={setDupLevels} min={0} max={9} color="#607D8B" />
{/* Decay removed - fixed at 100% */}

            {/* Team summary */}
            <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, bgcolor: alpha(ORO, 0.04), border: `1px solid ${alpha(ORO, 0.1)}` }}>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: ESPRESSO, mb: 0.5 }}>
                {isIt ? "Struttura Team" : "Team Structure"}
              </Typography>
              {calc.levels.map((l, i) => (
                <Stack key={i} direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>L{i + 1}</Typography>
                  <Typography sx={{ fontSize: "0.6rem", color: ESPRESSO, fontWeight: 600 }}>
                    {l.promoters} promo × {l.clientsEach} cli = {l.promoters * l.clientsEach} cli
                  </Typography>
                </Stack>
              ))}
              <Divider sx={{ my: 0.5 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: ESPRESSO }}>Totale</Typography>
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: ORO }}>
                  {calc.totalTeamPromoters} promo, {calc.totalTeamClients + clients} cli
                </Typography>
              </Stack>
            </Box>
          </Card>
        </Grid>

        {/* ── RIGHT: Results ── */}
        <Grid item xs={12} md={8}>
          {/* Total card */}
          <Card sx={{ p: 3, mb: 2, borderRadius: 3, bgcolor: ESPRESSO, position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", bgcolor: alpha(ORO, 0.06) }} />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: alpha("#fff", 0.5), textTransform: "uppercase", letterSpacing: 1 }}>
                  {isIt ? "Guadagno mensile ricorrente" : "Monthly recurring income"}
                </Typography>
                <Typography sx={{ fontSize: "2.5rem", fontWeight: 900, color: ORO, lineHeight: 1.1, mt: 0.3 }}>
                  €{calc.monthlyRecurring.toLocaleString("it-IT", { maximumFractionDigits: 0 })}
                </Typography>
                {calc.oneTime > 0 && (
                  <Typography sx={{ fontSize: "0.7rem", color: "#FF5722", fontWeight: 700, mt: 0.3 }}>
                    + €{calc.oneTime.toLocaleString()} one-time
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={7}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {[
                    { l: isIt ? "Annuale" : "Yearly", v: `€${(calc.monthlyRecurring * 12).toLocaleString("it-IT", { maximumFractionDigits: 0 })}` },
                    { l: "Rank", v: currentRank.name },
                    { l: "Team", v: `${calc.totalTeamPromoters} promo` },
                    { l: isIt ? "Clienti totali" : "Total clients", v: `${calc.totalTeamClients + clients}` },
                    { l: "Residual Lvl", v: `${calc.unlockedLevels}/9` },
                  ].map(b => (
                    <Box key={b.l} sx={{ bgcolor: alpha("#fff", 0.06), borderRadius: 1.5, px: 1.5, py: 0.5, minWidth: 75 }}>
                      <Typography sx={{ fontSize: "0.5rem", color: alpha("#fff", 0.4) }}>{b.l}</Typography>
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff" }}>{b.v}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Card>

          {/* Breakdown */}
          <Card sx={{ ...cs, p: 2, mb: 2 }}>
            <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: "#4CAF50", textTransform: "uppercase", mb: 0.5 }}>
              {isIt ? "Bonus Settimanali" : "Weekly Bonuses"}
            </Typography>
            <BonusRow icon="mdi:account-cash" label="Direct Sales" amount={calc.dsb} color="#FF9800" subtitle={`${hasKit ? "30%" : "15%"} × €${calc.totalClientBV.toFixed(0)} BV`} />
            <BonusRow icon="mdi:rocket" label="Fast Start" amount={calc.fastStart} color="#FF4081" subtitle={`${promoters} nuovi promoter × avg €${FAST_START_AVG.toFixed(0)}`} />
            <BonusRow icon="mdi:sitemap" label="Indirect Sales" amount={calc.isb} color="#00BCD4" subtitle={`4%/3%/3% L1-L3 (€${calc.totalTeamBV.toFixed(0)} team BV)`} />
            <BonusRow icon="mdi:account-group" label="MVP Mentor" amount={calc.mvpMentor} color="#9C27B0" subtitle={`€25 × ${Math.min(promoters, 10)} MVP`} />

            <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: ORO, textTransform: "uppercase", mt: 1.5, mb: 0.5 }}>
              {isIt ? "Bonus Mensili" : "Monthly Bonuses"}
            </Typography>
            <BonusRow icon="mdi:chart-timeline-variant" label="Residual" amount={calc.residual} color="#607D8B" subtitle={`${calc.unlockedLevels} levels, ${calc.smartshipClients}+ smartship`} />
            <BonusRow icon="mdi:crown" label="Leadership" amount={calc.leadership} color={ORO} subtitle={rankId >= 5 ? `2% Gen1 (€${(calc.levels[0]?.promoters * calc.levels[0]?.clientsEach * avgOrder * AVG_BV_RATIO || 0).toFixed(0)} BV) + 1% Gen2` : "Rank 5+"} />
            <BonusRow icon="mdi:swap-horizontal" label="Residual Matching" amount={calc.resMatching} color="#795548" subtitle="20% L1 + 10% L2 team residual" />
            <BonusRow icon="mdi:gift" label="3 For Free" amount={calc.threeff} color="#E91E63" subtitle={clients >= 3 ? `${clients} cli ≥ 3 ✓` : "Need 3+"} />
            <BonusRow icon="mdi:shield-star" label="Rock Solid MVP" amount={calc.rspMvp} color="#2196F3" subtitle={hasMvp ? "€100 + €150 power-up" : "Need MVP"} />
            <BonusRow icon="mdi:diamond-stone" label="Rock Solid Bonus" amount={calc.rockSolid} color="#455A64" subtitle={calc.rockSolid > 0 ? `€${calc.rockSolid.toLocaleString()}/mo (${currentRank.name})` : "Rank 4+"} />

            <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: "#FF5722", textTransform: "uppercase", mt: 1.5, mb: 0.5 }}>
              One-Time
            </Typography>
            <BonusRow icon="mdi:rocket-launch" label="Go MVP" amount={calc.goMvp} color="#4CAF50" subtitle={calc.goMvp > 0 ? "€250 ✓" : "Need kit + DQV + 3 cli"} />
            <BonusRow icon="mdi:trending-up" label="Evolving Bonus" amount={calc.evolvingOneTime} color="#FF5722" subtitle={calc.evolvingOneTime > 0 ? `€${calc.evolvingOneTime.toLocaleString()} (${currentRank.name})` : "Rank 4+"} />

            <Box sx={{ mt: 1, pt: 1, borderTop: "2px solid #f0ece6" }}>
              <BonusRow icon="mdi:refresh-circle" label="ROB Savings" amount={calc.robSavings} color="#8BC34A" subtitle="-10% + €30/3mo" />
            </Box>
          </Card>

          {/* Chart */}
          <Card sx={{ ...cs, p: 2, mb: 2 }}>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: ESPRESSO, mb: 1.5 }}>
              {isIt ? "Proiezione 12 mesi (+5%/mese crescita)" : "12-month projection (+5%/mo growth)"}
            </Typography>
            <Box sx={{ height: 160, display: "flex", alignItems: "flex-end", gap: "4px" }}>
              {calc.projection.map((p) => (
                <Box key={p.month} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Typography sx={{ fontSize: "0.5rem", color: ORO, fontWeight: 700, mb: 0.2 }}>
                    €{p.total >= 1000 ? `${(p.total / 1000).toFixed(1)}k` : p.total}
                  </Typography>
                  <Box sx={{
                    width: "100%", borderRadius: "3px 3px 0 0", transition: "height 0.5s",
                    height: `${Math.max(6, (p.total / maxBar) * 100)}%`, minHeight: 6,
                    background: `linear-gradient(180deg, ${ORO} 0%, ${alpha(ORO, 0.3)} 100%)`,
                  }} />
                  <Typography sx={{ fontSize: "0.5rem", color: MUTED, mt: 0.2 }}>M{p.month}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, bgcolor: alpha(SUCCESS, 0.05), border: `1px solid ${alpha(SUCCESS, 0.15)}`, textAlign: "center" }}>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: SUCCESS }}>
                12 {isIt ? "mesi" : "months"}: €{calc.projection[11].cumulative.toLocaleString()} {isIt ? "ricorrente" : "recurring"}
                {calc.oneTime > 0 && ` + €${calc.oneTime.toLocaleString()} one-time`}
              </Typography>
            </Box>
          </Card>

          {/* Motivation */}
          <Card sx={{ p: 2, borderRadius: 3, bgcolor: alpha(ORO, 0.04), border: `1px solid ${alpha(ORO, 0.15)}` }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Iconify icon="mdi:lightbulb-on" width={20} sx={{ color: ORO }} />
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: ESPRESSO }}>
                {isIt ? "Come crescere" : "How to grow"}
              </Typography>
            </Stack>
            <Stack spacing={0.8}>
              {rankId < 4 && (
                <Typography sx={{ fontSize: "0.75rem", color: MUTED }}>
                  👑 {isIt ? `Raggiungi Platinum per sbloccare Evolving (€400) e Rock Solid (€200/mese)` : `Reach Platinum to unlock Evolving (€400) and Rock Solid (€200/mo)`}
                </Typography>
              )}
              {promotersPerPromoter < 3 && (
                <Typography sx={{ fontSize: "0.75rem", color: MUTED }}>
                  🤝 {isIt ? `Se ogni promoter porta 3 promoter invece di ${promotersPerPromoter}, il team cresce ${Math.pow(3, 3)} volte più velocemente` : `If each promoter recruits 3 instead of ${promotersPerPromoter}, team grows ${Math.pow(3, 3)}x faster`}
                </Typography>
              )}
              {smartshipPct < 80 && (
                <Typography sx={{ fontSize: "0.75rem", color: MUTED }}>
                  🔄 {isIt ? `Porta lo smartship all'80%: il residual raddoppia e diventa reddito passivo` : `Push smartship to 80%: residual doubles and becomes passive income`}
                </Typography>
              )}
              {!hasKit && (
                <Typography sx={{ fontSize: "0.75rem", color: "#E24B4A", fontWeight: 600 }}>
                  ⚡ {isIt ? "Lo Starter Kit raddoppia il DSB dal 15% al 30%!" : "Starter Kit doubles DSB from 15% to 30%!"}
                </Typography>
              )}
              {rankId >= 8 && (
                <Typography sx={{ fontSize: "0.75rem", color: SUCCESS, fontWeight: 600 }}>
                  🏆 {isIt
                    ? `${currentRank.name}: Rock Solid €${(ROCK_SOLID[rankId] || 0).toLocaleString()}/mese + Evolving €${(EVOLVING[rankId] || 0).toLocaleString()} = vita da sogno!`
                    : `${currentRank.name}: Rock Solid €${(ROCK_SOLID[rankId] || 0).toLocaleString()}/mo + Evolving €${(EVOLVING[rankId] || 0).toLocaleString()} = dream life!`}
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
