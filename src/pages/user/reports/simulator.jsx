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

// Preset realistici per rank.
// dropoff = % di calo tra un livello e il successivo (0..80):
//   40% significa che ogni livello produce il 60% del precedente.
//   Alto = decadimento alto = team meno produttivo in profondità.
// activePct = % di promoter del team che sono qualificati / producono BV nel mese.
// growthPct = crescita mensile stimata della proiezione 12 mesi.
const RANK_PRESETS = {
  1:  { clients: 2,  avgOrder: 27, smartship: 30, promoters: 0,  clientsPerPromoter: 3, promotersPerPromoter: 0, dupLevels: 0, dropoff: 40, activePct: 100, growthPct: 1 },
  2:  { clients: 5,  avgOrder: 27, smartship: 50, promoters: 2,  clientsPerPromoter: 3, promotersPerPromoter: 1, dupLevels: 1, dropoff: 35, activePct: 80,  growthPct: 3 },
  3:  { clients: 8,  avgOrder: 30, smartship: 55, promoters: 3,  clientsPerPromoter: 4, promotersPerPromoter: 2, dupLevels: 2, dropoff: 40, activePct: 70,  growthPct: 4 },
  4:  { clients: 10, avgOrder: 30, smartship: 60, promoters: 5,  clientsPerPromoter: 4, promotersPerPromoter: 2, dupLevels: 3, dropoff: 40, activePct: 65,  growthPct: 5 },
  5:  { clients: 12, avgOrder: 35, smartship: 65, promoters: 7,  clientsPerPromoter: 5, promotersPerPromoter: 3, dupLevels: 4, dropoff: 45, activePct: 60,  growthPct: 5 },
  6:  { clients: 15, avgOrder: 35, smartship: 70, promoters: 10, clientsPerPromoter: 5, promotersPerPromoter: 3, dupLevels: 5, dropoff: 45, activePct: 60,  growthPct: 4 },
  7:  { clients: 18, avgOrder: 40, smartship: 75, promoters: 12, clientsPerPromoter: 5, promotersPerPromoter: 3, dupLevels: 6, dropoff: 50, activePct: 55,  growthPct: 4 },
  8:  { clients: 20, avgOrder: 40, smartship: 80, promoters: 15, clientsPerPromoter: 6, promotersPerPromoter: 4, dupLevels: 7, dropoff: 50, activePct: 55,  growthPct: 3 },
  9:  { clients: 25, avgOrder: 45, smartship: 85, promoters: 18, clientsPerPromoter: 6, promotersPerPromoter: 4, dupLevels: 8, dropoff: 55, activePct: 50,  growthPct: 3 },
  10: { clients: 30, avgOrder: 50, smartship: 90, promoters: 20, clientsPerPromoter: 7, promotersPerPromoter: 5, dupLevels: 9, dropoff: 55, activePct: 50,  growthPct: 2 },
};

// Scenario preset: moltiplicatori globali su dropoff, active% e smartship.
// Pessimistico = piu' decadimento, meno attivi, meno smartship.
// Ottimistico = meno decadimento, piu' attivi, piu' smartship.
const SCENARIOS = {
  pessimistic: { dropoffMul: 1.25, activeMul: 0.75, smartshipMul: 0.80, label: "Pessimistico" },
  realistic:   { dropoffMul: 1.00, activeMul: 1.00, smartshipMul: 1.00, label: "Realistico" },
  optimistic:  { dropoffMul: 0.75, activeMul: 1.15, smartshipMul: 1.10, label: "Ottimistico" },
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
  // Dropoff: % di scarto tra un livello e il successivo. Alto = piu' decadimento.
  // 40% significa che il livello successivo produce il 60% del precedente.
  const [dropoff, setDropoff] = useState(40);
  // Active %: quota del team che è effettivamente qualificata e produce BV nel mese.
  const [activePct, setActivePct] = useState(70);
  // Growth %: crescita mensile usata SOLO nella proiezione 12 mesi (grafico).
  const [growthPct, setGrowthPct] = useState(4);
  const [scenario, setScenario] = useState("realistic");
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
    setDropoff(p.dropoff);
    setActivePct(p.activePct);
    setGrowthPct(p.growthPct);
    setScenario("realistic");
    setRankId(rid);
    setHasKit(rid >= 2);
    setHasMvp(rid >= 2);
  }, []);

  const applyScenario = useCallback((key) => {
    setScenario(key);
  }, []);

  const calc = useMemo(() => {
    const sc = SCENARIOS[scenario] || SCENARIOS.realistic;
    const bvClient = avgOrder * AVG_BV_RATIO;
    // Smartship effettivo: scenario applica un moltiplicatore (cap 100%).
    const effSmartshipPct = Math.min(100, smartshipPct * sc.smartshipMul);
    const smartshipClients = Math.round(clients * effSmartshipPct / 100);
    const smartshipBV = smartshipClients * bvClient;
    // Dropoff effettivo (cap 95% di scarto = il livello successivo produce 5%).
    // Scenario "pessimistic" amplifica lo scarto, "optimistic" lo riduce.
    const effDropoff = Math.min(0.95, (dropoff / 100) * sc.dropoffMul);
    // Decay = fattore di produzione del livello successivo (1 - scarto).
    const decay = Math.max(0.05, 1 - effDropoff);
    // Active %: quota promoter effettivamente attivi nel mese.
    const effActive = Math.min(1, (activePct / 100) * sc.activeMul);

    // Build team tree per level (struttura "nominale", senza ancora applicare l'active%).
    const levels = [{ promoters: promoters, clientsEach: clientsPerPromoter }];
    for (let i = 1; i < Math.min(dupLevels, 9); i++) {
      const prev = levels[i - 1];
      const p = Math.round(prev.promoters * promotersPerPromoter * Math.pow(decay, i));
      // Anche i clienti per promoter calano leggermente in profondità (decay più morbido).
      const c = Math.max(1, Math.round(clientsPerPromoter * Math.pow(decay, i * 0.5)));
      levels.push({ promoters: Math.min(p, 5000), clientsEach: c });
    }

    const totalTeamPromoters = levels.reduce((s, l) => s + l.promoters, 0);
    const totalTeamClients = levels.reduce((s, l) => s + l.promoters * l.clientsEach, 0);
    // BV produttivo: solo la quota "active" del team contribuisce ai bonus.
    // Smartship decay per livello: i livelli profondi hanno smartship più basso.
    const lvlBVProducing = levels.map((l, i) => {
      const smartshipLvlPct = effSmartshipPct * Math.pow(0.9, i); // -10%/livello
      const activeProducing = l.promoters * effActive;
      const allBV = activeProducing * l.clientsEach * bvClient;
      const smartshipBVLvl = activeProducing * l.clientsEach * bvClient * (smartshipLvlPct / 100);
      return { allBV, smartshipBVLvl };
    });
    const totalTeamBV = lvlBVProducing.reduce((s, x) => s + x.allBV, 0);
    const totalClientBV = clients * bvClient;

    // 1. DSB (personal clients only — il promoter è sempre attivo)
    const dsb = totalClientBV * (hasKit ? DSB_PCT.starter : DSB_PCT.default);

    // 2. ISB (L1-L3 BV producing solo dai promoter attivi)
    let isb = 0;
    for (let i = 0; i < Math.min(3, levels.length); i++) {
      isb += lvlBVProducing[i].allBV * ISB_PCT[i];
    }

    // 3. 3FF
    const threeff = clients >= 3 ? Math.min(THREE_FF_MAX, avgOrder * 3 * 0.33) : 0;

    // 4. Go MVP
    const goMvp = (hasKit && hasMvp) ? MVP_BONUS : 0;

    // 5. RSP MVP
    const rspMvp = (hasKit && hasMvp) ? RSP_MVP.base + RSP_MVP.powerup : 0;

    // 6. MVP Mentor
    const mvpMentor = hasMvp ? MVP_MENTOR * Math.min(promoters, 10) : 0;

    // 6b. Fast Start Bonus (one-time, solo sui promoter "attivi" che si attivano davvero col kit)
    const fastStart = Math.round(promoters * effActive) * FAST_START_AVG;

    // 7. Residual Bonus (smartship BV per level, già "producing")
    const unlockedLevels = RESIDUAL_UNLOCK.filter(r => r <= rankId).length;
    let residual = 0;
    residual += smartshipBV * RESIDUAL_PCT[0];
    for (let i = 1; i < Math.min(unlockedLevels, levels.length + 1); i++) {
      const lvlIdx = i - 1;
      if (lvlIdx < levels.length) {
        residual += lvlBVProducing[lvlIdx].smartshipBVLvl * (RESIDUAL_PCT[i] || 0);
      }
    }

    // 8. Leadership (rank 5+, 2% gen1 BV producing + 1% gen2 BV producing)
    const gen1BV = lvlBVProducing[0]?.allBV || 0;
    const gen2BV = lvlBVProducing[1]?.allBV || 0;
    const leadership = rankId >= 5 ? gen1BV * LEADERSHIP_GEN1 + gen2BV * LEADERSHIP_GEN2 : 0;

    // 9. Residual Matching (20% L1 + 10% L2 of directs' residual earnings producing)
    const directsResidualEarning = lvlBVProducing[0]
      ? (lvlBVProducing[0].smartshipBVLvl * 0.025) : 0;
    const l2ResidualEarning = lvlBVProducing[1]
      ? (lvlBVProducing[1].smartshipBVLvl * 0.025) * 0.5 : 0;
    const resMatching = directsResidualEarning * RESMATCHING_L1 + l2ResidualEarning * RESMATCHING_L2;

    // 10. Evolving (one-time)
    const evolvingOneTime = EVOLVING[rankId] || 0;

    // 11. Ritual (monthly)
    const rockSolid = ROCK_SOLID[rankId] || 0;

    // 12. ROB
    const robSavings = avgOrder * ROB_DISCOUNT + ROB_COUPON / 3;

    const monthlyRecurring = dsb + isb + residual + threeff + leadership + resMatching + rockSolid + rspMvp + mvpMentor;
    const oneTime = goMvp + evolvingOneTime;

    // Split Personal vs Team: aiuta il promoter a capire quanto viene dal proprio
    // lavoro diretto vs quanto matura dal team costruito. Impatto pedagogico:
    // ai rank alti la quota "team" cresce e mostra il valore della duplicazione.
    const personalMonthly = dsb + threeff + rspMvp + mvpMentor;
    const teamMonthly = isb + residual + leadership + resMatching + rockSolid;

    // Sensitivity analysis: mostra quanto cambia il ricorrente aggiungendo 1
    // unita' a ciascuna leva. Utile per capire dove concentrare l'energia.
    // Delta client: DSB del cliente aggiuntivo (piu' contributo residual se smartship attivo).
    const deltaClient1 = bvClient * (hasKit ? DSB_PCT.starter : DSB_PCT.default)
      + bvClient * (effSmartshipPct / 100) * RESIDUAL_PCT[0]; // residual personal del cliente extra
    // Delta promoter: ISB L1 (4%) del BV del promoter attivo + il suo contributo residual
    // level 1 (se rank basso, unlocked). NB: qui ipotizziamo che sia gia' attivo.
    const deltaPromoter1 = clientsPerPromoter * bvClient * ISB_PCT[0]
      + (unlockedLevels >= 2 ? clientsPerPromoter * bvClient * (effSmartshipPct / 100) * RESIDUAL_PCT[1] : 0);
    // Delta smartship: incluso l'impatto sui livelli team downline (dove il residual scala).
    // Metodo: rifaccio il calcolo residual con smartshipRatio applicato ovunque, sottraggo il vecchio.
    const newSmartshipPct = Math.min(100, effSmartshipPct + 10);
    const smartshipRatio = effSmartshipPct > 0 ? newSmartshipPct / effSmartshipPct : 1;
    let deltaSmartship10pt = smartshipBV * (smartshipRatio - 1) * RESIDUAL_PCT[0]; // personal delta
    for (let i = 1; i < Math.min(unlockedLevels, levels.length + 1); i++) {
      const lvlIdx = i - 1;
      if (lvlIdx < levels.length) {
        deltaSmartship10pt += lvlBVProducing[lvlIdx].smartshipBVLvl * (smartshipRatio - 1) * (RESIDUAL_PCT[i] || 0);
      }
    }

    // Break-even Kit Promoter (€79) e Founder Pack (€1000) sul ricorrente
    // atteso. Risponde alla domanda #1 di ogni nuovo promoter: "in quanto
    // tempo rientro dall'investimento iniziale?"
    const breakEvenKit = monthlyRecurring > 0 ? Math.ceil(79 / monthlyRecurring) : null;
    const breakEvenFounder = monthlyRecurring > 0 ? Math.ceil(1000 / monthlyRecurring) : null;

    // Next rank preview: quanto guadagni SE sali al rank successivo.
    // Sblocchi: piu' livelli residual (+% variabile), Ritual bonus fisso,
    // Evolving bonus one-time.
    const nextRankId = Math.min(rankId + 1, 10);
    const nextRank = RANKS.find(r => r.id === nextRankId) || RANKS[9];
    const nextUnlockedLevels = RESIDUAL_UNLOCK.filter(r => r <= nextRankId).length;
    // Guadagno extra dai livelli residual che si sbloccano col rank up
    let extraResidualFromUpgrade = 0;
    for (let i = unlockedLevels; i < Math.min(nextUnlockedLevels, levels.length + 1); i++) {
      const lvlIdx = i - 1;
      if (lvlIdx >= 0 && lvlIdx < levels.length) {
        extraResidualFromUpgrade += lvlBVProducing[lvlIdx].smartshipBVLvl * (RESIDUAL_PCT[i] || 0);
      }
    }
    const nextRitual = ROCK_SOLID[nextRankId] || 0;
    const nextRitualDelta = nextRitual - rockSolid;
    const nextLeadershipBoost = (rankId < 5 && nextRankId >= 5) ? (gen1BV * LEADERSHIP_GEN1 + gen2BV * LEADERSHIP_GEN2) : 0;
    const nextRankExtraMonthly = extraResidualFromUpgrade + nextRitualDelta + nextLeadershipBoost;
    const nextRankOneTime = (EVOLVING[nextRankId] || 0);

    // Projection 12 months con growth compound (più realistico di lineare)
    const gMonthly = growthPct / 100;
    const projection = Array.from({ length: 12 }, (_, i) => {
      const g = Math.pow(1 + gMonthly, i);
      return { month: i + 1, total: Math.round(monthlyRecurring * g) };
    });
    let cum = 0;
    projection.forEach(p => { cum += p.total; p.cumulative = cum; });

    // Active promoters per livello (per la struttura team mostrata in UI)
    const activeTeamPromoters = Math.round(totalTeamPromoters * effActive);

    return {
      dsb, isb, threeff, goMvp, rspMvp, mvpMentor, fastStart, residual, leadership, resMatching,
      evolvingOneTime, rockSolid, robSavings, monthlyRecurring, oneTime, projection,
      totalClientBV, totalTeamBV, totalTeamPromoters, totalTeamClients, levels,
      smartshipClients, unlockedLevels, activeTeamPromoters, effActive, effSmartshipPct,
      scenario: sc,
      // v2 pedagogic
      personalMonthly, teamMonthly,
      deltaClient1, deltaPromoter1, deltaSmartship10pt,
      breakEvenKit, breakEvenFounder,
      nextRank, nextUnlockedLevels, nextRankExtraMonthly, nextRankOneTime,
    };
  }, [clients, avgOrder, smartshipPct, promoters, clientsPerPromoter, promotersPerPromoter, dupLevels, dropoff, activePct, growthPct, scenario, rankId, hasKit, hasMvp]);

  const maxBar = Math.max(...calc.projection.map(p => p.total), 1);
  const minBar = Math.min(...calc.projection.map(p => p.total), 0);
  // Scala min-max: la barra piu' bassa parte al 30%, la piu' alta al 100%.
  // Cosi' anche M1 e' ben visibile e si percepisce chiaramente la crescita.
  const barHeight = (total) => {
    if (maxBar === minBar) return 60;
    return 30 + ((total - minBar) / (maxBar - minBar)) * 70;
  };
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

            <Divider sx={{ my: 1 }} />
            <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", mb: 0.5 }}>
              {isIt ? "Realismo (scarto reale)" : "Realism factors"}
            </Typography>
            <Stack direction="row" spacing={0.5} mb={1}>
              {Object.entries(SCENARIOS).map(([key, s]) => (
                <Chip key={key} label={isIt ? s.label : key} size="small" onClick={() => applyScenario(key)}
                  sx={{ flex: 1, cursor: "pointer", fontWeight: 700, fontSize: "0.6rem",
                    bgcolor: scenario === key ? alpha(ORO, 0.15) : "#f5f5f5",
                    color: scenario === key ? ORO : MUTED,
                    border: `1px solid ${scenario === key ? ORO : "#eee"}` }} />
              ))}
            </Stack>
            <SliderInput icon="mdi:trending-down" label={isIt ? "Scarto per livello (più alto = più calo)" : "Per-level dropoff (higher = bigger drop)"} value={dropoff} onChange={setDropoff} min={0} max={80} step={5} unit="%" color="#FF7043" />
            <SliderInput icon="mdi:account-check" label={isIt ? "Promoter attivi" : "Active promoters"} value={activePct} onChange={setActivePct} min={20} max={100} step={5} unit="%" color="#26A69A" />
            <SliderInput icon="mdi:chart-line" label={isIt ? "Crescita mensile (solo proiezione 12m)" : "Monthly growth (12m chart only)"} value={growthPct} onChange={setGrowthPct} min={0} max={15} unit="%" color="#7E57C2" />

            {/* Team summary */}
            <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, bgcolor: alpha(ORO, 0.04), border: `1px solid ${alpha(ORO, 0.1)}` }}>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: ESPRESSO, mb: 0.5 }}>
                {isIt ? "Struttura Team" : "Team Structure"}
              </Typography>
              {calc.levels.map((l, i) => {
                const active = Math.round(l.promoters * calc.effActive);
                // Livello sbloccato per residual? unlockedLevels vale 4 per rank 5, ecc.
                // I livelli con index >= unlockedLevels sono locked (nessun residual).
                // NB: ISB copre L1-L3 sempre, indipendente dal rank.
                const isResidualUnlocked = i + 1 <= calc.unlockedLevels;
                const isIsbLevel = i < 3;
                const anyBonus = isResidualUnlocked || isIsbLevel;
                return (
                  <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={0.3} alignItems="center">
                      <Typography sx={{ fontSize: "0.6rem", color: MUTED }}>L{i + 1}</Typography>
                      {!anyBonus && (
                        <Iconify icon="mdi:lock" width={10} sx={{ color: "#bbb" }} title={isIt ? "Livello non sbloccato al tuo rank" : "Level not unlocked at your rank"} />
                      )}
                      {isResidualUnlocked && i >= 3 && (
                        <Iconify icon="mdi:check-circle" width={10} sx={{ color: SUCCESS }} title={isIt ? "Residual sbloccato" : "Residual unlocked"} />
                      )}
                    </Stack>
                    <Typography sx={{ fontSize: "0.6rem", color: anyBonus ? ESPRESSO : "#bbb", fontWeight: 600 }}>
                      {l.promoters} promo ({active} {isIt ? "att." : "act."}) × {l.clientsEach} cli
                    </Typography>
                  </Stack>
                );
              })}
              <Divider sx={{ my: 0.5 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: ESPRESSO }}>{isIt ? "Totale" : "Total"}</Typography>
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: ORO }}>
                  {calc.totalTeamPromoters} promo ({calc.activeTeamPromoters} {isIt ? "attivi" : "active"})
                </Typography>
              </Stack>
            </Box>
          </Card>
        </Grid>

        {/* ── RIGHT: Results ── */}
        <Grid item xs={12} md={8}>
          {/* Compliance banner v2 — sempre visibile in top */}
          <Box sx={{ mb: 1.5, p: 1.2, borderRadius: 2, bgcolor: "#fff8e1", border: "1px solid #ffe082", display: "flex", alignItems: "center", gap: 1 }}>
            <Iconify icon="mdi:information-outline" width={16} sx={{ color: "#f57c00", flexShrink: 0 }} />
            <Typography sx={{ fontSize: "0.68rem", color: "#5d4037", lineHeight: 1.35 }}>
              {isIt
                ? <>Stima <strong>indicativa</strong> non garantita. I risultati dipendono da impegno individuale, mercato e capacità di reclutamento. Fa fede il <a href="https://cdn.shopify.com/s/files/1/1013/1629/7050/files/Evea_Global_02_Piano_Compensi_v1_8.pdf?v=1786290950" target="_blank" rel="noreferrer" style={{ color: "#B8963B", fontWeight: 700 }}>Piano Compensi ufficiale v1.8</a>.</>
                : <>Estimate for <strong>illustrative purposes only</strong>. Results depend on individual effort. See <a href="https://cdn.shopify.com/s/files/1/1013/1629/7050/files/Evea_Global_02_Piano_Compensi_v1_8.pdf?v=1786290950" target="_blank" rel="noreferrer" style={{ color: "#B8963B", fontWeight: 700 }}>official Compensation Plan v1.8</a>.</>
              }
            </Typography>
          </Box>

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

          {/* v2 — Split Personal vs Team */}
          <Card sx={{ ...cs, p: 2, mb: 2 }}>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: ESPRESSO, mb: 1 }}>
              <Iconify icon="mdi:chart-donut-variant" width={14} sx={{ mr: 0.5, verticalAlign: "middle", color: ORO }} />
              {isIt ? "Da dove viene il tuo guadagno" : "Where your income comes from"}
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha("#FF9800", 0.08), border: `1px solid ${alpha("#FF9800", 0.2)}` }}>
                  <Stack direction="row" alignItems="center" spacing={0.5} mb={0.3}>
                    <Iconify icon="mdi:account-star" width={14} sx={{ color: "#FF9800" }} />
                    <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: "#E65100" }}>
                      {isIt ? "Il tuo lavoro diretto" : "Your direct work"}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "1.4rem", fontWeight: 900, color: "#FF9800", lineHeight: 1 }}>
                    €{Math.round(calc.personalMonthly).toLocaleString("it-IT")}
                  </Typography>
                  <Typography sx={{ fontSize: "0.55rem", color: MUTED, mt: 0.3 }}>
                    DSB + 3FF + MVP + Mentor
                  </Typography>
                  <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#FF9800", mt: 0.3 }}>
                    {calc.monthlyRecurring > 0 ? Math.round(calc.personalMonthly / calc.monthlyRecurring * 100) : 0}% {isIt ? "del totale" : "of total"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(ORO, 0.08), border: `1px solid ${alpha(ORO, 0.2)}` }}>
                  <Stack direction="row" alignItems="center" spacing={0.5} mb={0.3}>
                    <Iconify icon="mdi:account-group" width={14} sx={{ color: ORO }} />
                    <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: ESPRESSO }}>
                      {isIt ? "Il tuo team" : "Your team"}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "1.4rem", fontWeight: 900, color: ORO, lineHeight: 1 }}>
                    €{Math.round(calc.teamMonthly).toLocaleString("it-IT")}
                  </Typography>
                  <Typography sx={{ fontSize: "0.55rem", color: MUTED, mt: 0.3 }}>
                    ISB + Residual + Leadership + Ritual
                  </Typography>
                  <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: ORO, mt: 0.3 }}>
                    {calc.monthlyRecurring > 0 ? Math.round(calc.teamMonthly / calc.monthlyRecurring * 100) : 0}% {isIt ? "del totale" : "of total"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Typography sx={{ fontSize: "0.62rem", color: MUTED, mt: 1, fontStyle: "italic", textAlign: "center" }}>
              {isIt
                ? `💡 Ai rank alti la quota "Team" cresce: e' il valore della duplicazione`
                : `💡 At higher ranks the "Team" share grows: it's the value of duplication`}
            </Typography>
          </Card>

          {/* v2 — Sensitivity + Break-even */}
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ ...cs, p: 1.5, height: "100%" }}>
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: ESPRESSO, mb: 0.7 }}>
                  <Iconify icon="mdi:trending-up" width={13} sx={{ mr: 0.4, verticalAlign: "middle", color: SUCCESS }} />
                  {isIt ? "Cosa cambia se..." : "What if..."}
                </Typography>
                <Stack spacing={0.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: "0.63rem", color: MUTED }}>{isIt ? "+1 cliente" : "+1 client"}</Typography>
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: SUCCESS }}>+€{calc.deltaClient1.toFixed(0)}/{isIt ? "mese" : "mo"}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: "0.63rem", color: MUTED }}>{isIt ? "+1 promoter attivo" : "+1 active promoter"}</Typography>
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: SUCCESS }}>+€{calc.deltaPromoter1.toFixed(0)}/{isIt ? "mese" : "mo"}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: "0.63rem", color: MUTED }}>{isIt ? "+10% smartship" : "+10% smartship"}</Typography>
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: SUCCESS }}>+€{Math.max(0, calc.deltaSmartship10pt).toFixed(0)}/{isIt ? "mese" : "mo"}</Typography>
                  </Stack>
                  {rankId < 10 && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 0.4, borderTop: "1px dashed #eee" }}>
                      <Typography sx={{ fontSize: "0.63rem", color: ORO, fontWeight: 700 }}>{isIt ? `Sali a ${calc.nextRank.name}` : `Reach ${calc.nextRank.name}`}</Typography>
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: ORO }}>
                        +€{Math.round(calc.nextRankExtraMonthly).toLocaleString("it-IT")}/{isIt ? "mese" : "mo"}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ ...cs, p: 1.5, height: "100%" }}>
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: ESPRESSO, mb: 0.7 }}>
                  <Iconify icon="mdi:cash-refund" width={13} sx={{ mr: 0.4, verticalAlign: "middle", color: "#2196F3" }} />
                  {isIt ? "Break-even investimento" : "Investment break-even"}
                </Typography>
                <Stack spacing={0.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: "0.63rem", color: MUTED }}>Kit Promoter €79</Typography>
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#2196F3" }}>
                      {calc.breakEvenKit ? `~${calc.breakEvenKit} ${isIt ? (calc.breakEvenKit === 1 ? "mese" : "mesi") : (calc.breakEvenKit === 1 ? "mo" : "mos")}` : "—"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: "0.63rem", color: MUTED }}>Founder Pack €1.000</Typography>
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#2196F3" }}>
                      {calc.breakEvenFounder ? `~${calc.breakEvenFounder} ${isIt ? (calc.breakEvenFounder === 1 ? "mese" : "mesi") : (calc.breakEvenFounder === 1 ? "mo" : "mos")}` : "—"}
                    </Typography>
                  </Stack>
                  {calc.nextRankOneTime > 0 && rankId < 10 && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 0.4, borderTop: "1px dashed #eee" }}>
                      <Typography sx={{ fontSize: "0.62rem", color: ORO }}>{isIt ? `Bonus Evolving ${calc.nextRank.name}` : `Evolving Bonus ${calc.nextRank.name}`}</Typography>
                      <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, color: ORO }}>
                        €{calc.nextRankOneTime.toLocaleString("it-IT")}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
                <Typography sx={{ fontSize: "0.55rem", color: MUTED, mt: 0.7, fontStyle: "italic" }}>
                  {isIt ? "Al ricorrente mensile attuale, senza crescita" : "At current monthly recurring, no growth"}
                </Typography>
              </Card>
            </Grid>
          </Grid>

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
            <BonusRow icon="mdi:diamond-stone" label="Ritual Bonus" amount={calc.rockSolid} color="#455A64" subtitle={calc.rockSolid > 0 ? `€${calc.rockSolid.toLocaleString()}/mo (${currentRank.name})` : "Rank 4+"} />

            <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: "#FF5722", textTransform: "uppercase", mt: 1.5, mb: 0.5 }}>
              One-Time
            </Typography>
            <BonusRow icon="mdi:rocket-launch" label="Go MVP" amount={calc.goMvp} color="#4CAF50" subtitle={calc.goMvp > 0 ? "€250 ✓" : "Need kit + DQV + 3 cli"} />
            <BonusRow icon="mdi:trending-up" label="Evolving Bonus" amount={calc.evolvingOneTime} color="#FF5722" subtitle={calc.evolvingOneTime > 0 ? `€${calc.evolvingOneTime.toLocaleString()} (${currentRank.name})` : "Rank 4+"} />

            <Box sx={{ mt: 1, pt: 1, borderTop: "2px solid #f0ece6" }}>
              <BonusRow icon="mdi:refresh-circle" label="ROB Savings" amount={calc.robSavings} color="#8BC34A" subtitle="-10% + 🎁/3mo" />
            </Box>
          </Card>

          {/* Chart */}
          <Card sx={{ ...cs, p: 2, mb: 2 }}>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: ESPRESSO, mb: 0.3 }}>
              {isIt ? `Proiezione 12 mesi — SE mantieni +${growthPct}%/mese` : `12-month projection — IF you maintain +${growthPct}%/mo`}
            </Typography>
            <Typography sx={{ fontSize: "0.6rem", color: MUTED, mb: 1.5, fontStyle: "italic" }}>
              {isIt
                ? `Il grafico applica la crescita che hai impostato al ricorrente attuale. E' teorico: dipende da nuovi clienti e promoter reali.`
                : `Chart applies the growth you set to your current recurring. It's theoretical: depends on real new clients and promoters.`}
            </Typography>
            {promoters === 0 && growthPct > 2 && (
              <Box sx={{ mb: 1.5, p: 1, borderRadius: 1.5, bgcolor: alpha("#FF5722", 0.08), border: `1px solid ${alpha("#FF5722", 0.25)}`, display: "flex", alignItems: "center", gap: 0.8 }}>
                <Iconify icon="mdi:alert-circle" width={14} sx={{ color: "#FF5722", flexShrink: 0 }} />
                <Typography sx={{ fontSize: "0.65rem", color: "#5D4037", lineHeight: 1.35 }}>
                  {isIt
                    ? `Con 0 promoter diretti la crescita organica reale e' vicino allo zero. Il grafico e' puramente ipotetico.`
                    : `With 0 direct promoters real organic growth is near zero. The chart is purely hypothetical.`}
                </Typography>
              </Box>
            )}
            <Box sx={{ height: 240, display: "flex", alignItems: "flex-end", gap: "5px", px: 0.5 }}>
              {calc.projection.map((p) => (
                <Box key={p.month} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                  <Typography sx={{ fontSize: "0.7rem", color: ESPRESSO, fontWeight: 800, mb: 0.4, whiteSpace: "nowrap" }}>
                    €{p.total >= 1000 ? `${(p.total / 1000).toFixed(1)}k` : p.total}
                  </Typography>
                  <Box sx={{
                    width: "100%", borderRadius: "4px 4px 0 0", transition: "height 0.5s",
                    height: `${barHeight(p.total)}%`, minHeight: 12,
                    background: `linear-gradient(180deg, ${ORO} 0%, ${alpha(ORO, 0.35)} 100%)`,
                    boxShadow: `inset 0 -2px 0 ${alpha(ORO, 0.4)}`,
                  }} />
                  <Typography sx={{ fontSize: "0.65rem", color: MUTED, mt: 0.4, fontWeight: 600 }}>M{p.month}</Typography>
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

          {/* Disclaimer compliance (la card "Come crescere" è stata rimossa) */}
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(ORO, 0.03), border: `1px dashed ${alpha(ORO, 0.2)}` }}>
            <Typography sx={{ fontSize: "0.65rem", color: MUTED, fontStyle: "italic", lineHeight: 1.4 }}>
              {isIt
                ? `⚠ Stima indicativa. Tiene conto di scarto per livello (${Math.round(dropoff * calc.scenario.dropoffMul)}%), promoter attivi (${Math.round(activePct * calc.scenario.activeMul)}%) e smartship calante in profondità. Nella realtà MLM i risultati variano in base a churn, capacità di reclutamento e tasso di chiusura clienti. Non garantisce alcun guadagno.`
                : `⚠ Indicative estimate. Includes per-level dropoff (${Math.round(dropoff * calc.scenario.dropoffMul)}%), active promoters (${Math.round(activePct * calc.scenario.activeMul)}%) and decreasing smartship at depth. Real MLM results vary based on churn, recruiting and close rate. No earnings guaranteed.`}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SimulatorReport;
