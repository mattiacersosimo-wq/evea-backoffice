import { Box, Breadcrumbs, Button, Card, Chip, CircularProgress, Collapse, Grid, IconButton, LinearProgress, Link, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";

// Activity indicator color
const getActivityColor = (days) => {
  if (days === null || days === undefined) return "#ddd";
  if (days <= 7) return "#4CAF50";
  if (days <= 21) return "#8BC34A";
  if (days <= 30) return "#EF9F27";
  return "#E24B4A";
};

// Level background opacity
const getLevelBg = (level) => {
  const opacity = Math.max(0.02, 0.12 - (level - 1) * 0.012);
  return alpha(ORO, opacity);
};

const FILTERS = [
  { value: "all", label: "Tutti", labelEn: "All" },
  { value: "promoter", label: "Solo Promoter", labelEn: "Promoters only" },
  { value: "customer", label: "Solo Clienti", labelEn: "Customers only" },
  { value: "smartship", label: "Con Smartship", labelEn: "With Smartship" },
  { value: "inactive", label: "Inattivi (30gg+)", labelEn: "Inactive (30d+)" },
];

const COLUMNS = [
  { id: "level", label: "Lv", labelEn: "Lv", width: 40 },
  { id: "name", label: "Nome", labelEn: "Name", width: 140 },
  { id: "username", label: "Username", labelEn: "Username", width: 120 },
  { id: "type", label: "Tipo", labelEn: "Type", width: 70 },
  { id: "rank", label: "Rank", labelEn: "Rank", width: 100 },
  { id: "pqv", label: "PQV", labelEn: "PQV", width: 70, numeric: true },
  { id: "tv", label: "TV", labelEn: "TV", width: 70, numeric: true },
  { id: "gv", label: "GV", labelEn: "GV", width: 70, numeric: true },
  { id: "revenue", label: "Revenue", labelEn: "Revenue", width: 80, numeric: true },
  { id: "smartship", label: "SS", labelEn: "SS", width: 50 },
  { id: "last_order", label: "Ultimo ordine", labelEn: "Last order", width: 100 },
  { id: "action", label: "", labelEn: "", width: 40, noSort: true },
];

const TeamUnified = () => {
  const { t, i18n } = useTranslation();
  const isIt = i18n.language?.startsWith("it");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("level");
  const [order, setOrder] = useState("asc");
  const [viewAs, setViewAs] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);

  const fetchData = useCallback(async (userId) => {
    setLoading(true);
    try {
      const url = userId ? `api/wp/reports/team-unified?view_as=${userId}` : "api/wp/reports/team-unified";
      const { data: r } = await axiosInstance.get(url);
      setData(r?.data || []);
      setBreadcrumb(r?.breadcrumb || []);
    } catch (e) { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(viewAs); }, [viewAs, fetchData]);

  const handleViewTeam = (userId) => {
    setViewAs(userId);
    setSearch("");
    setFilter("all");
    setExpanded(null);
  };

  const handleBreadcrumb = (userId) => {
    if (!userId) { setViewAs(null); setBreadcrumb([]); }
    else setViewAs(userId);
  };

  const handleSort = (col) => {
    if (orderBy === col) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(col);
      setOrder("desc");
    }
  };

  // Rank order map for correct sorting
  const RANK_ORDER = {
    "Associate": 1, "Starter": 2, "Builder": 3, "Senior Builder": 4,
    "Platinum": 5, "Sapphire": 6, "Ruby": 7, "Emerald": 8,
    "Diamond": 9, "Blue Diamond": 10, "Crown Diamond": 11,
  };

  // Available levels for filter
  const availableLevels = [...new Set(data.map((m) => m.level))].sort((a, b) => a - b);

  // Filter
  let filtered = data;
  if (filter === "promoter") filtered = filtered.filter((m) => m.type === "promoter");
  if (filter === "customer") filtered = filtered.filter((m) => m.type === "customer");
  if (filter === "smartship") filtered = filtered.filter((m) => m.smartship);
  if (filter === "inactive") filtered = filtered.filter((m) => m.days_inactive >= 30 || m.days_inactive === null);
  if (levelFilter !== "all") filtered = filtered.filter((m) => m.level === parseInt(levelFilter));
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((m) => m.username?.toLowerCase().includes(s) || m.name?.toLowerCase().includes(s));
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (orderBy === "level") {
      return order === "asc" ? a.level - b.level : b.level - a.level;
    }

    // Rank: sort by rank hierarchy, not alphabetically
    if (orderBy === "rank") {
      const ra = RANK_ORDER[a.rank] || 0;
      const rb = RANK_ORDER[b.rank] || 0;
      return order === "asc" ? ra - rb : rb - ra;
    }

    let va = a[orderBy], vb = b[orderBy];
    // Force numeric for known numeric fields
    if (["pqv", "tv", "gv", "revenue"].includes(orderBy)) {
      va = parseFloat(va) || 0;
      vb = parseFloat(vb) || 0;
    }
    if (va === null || va === undefined) va = orderBy === "last_order" ? "" : -1;
    if (vb === null || vb === undefined) vb = orderBy === "last_order" ? "" : -1;
    if (typeof va === "string") return order === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return order === "asc" ? va - vb : vb - va;
  });

  const totals = {
    pqv: filtered.reduce((s, m) => s + (m.pqv || 0), 0),
    tv: filtered.reduce((s, m) => s + (m.tv || 0), 0),
    gv: filtered.reduce((s, m) => s + (m.gv || 0), 0),
    revenue: filtered.reduce((s, m) => s + (m.revenue || 0), 0),
  };

  const [expanded, setExpanded] = useState(null);

  const stats = {
    total: data.length,
    promoters: data.filter((m) => m.type === "promoter").length,
    customers: data.filter((m) => m.type === "customer").length,
    smartship: data.filter((m) => m.smartship).length,
    active7d: data.filter((m) => m.days_inactive !== null && m.days_inactive <= 7).length,
    inactive30d: data.filter((m) => m.days_inactive >= 30 || m.days_inactive === null).length,
    retention: data.length > 0 ? Math.round(data.filter((m) => m.days_inactive !== null && m.days_inactive <= 30).length / data.length * 100) : 0,
  };

  if (loading) return <Box sx={{ textAlign: "center", py: 6 }}><CircularProgress sx={{ color: ORO }} /></Box>;

  return (
    <Stack spacing={2}>
      {/* Breadcrumb navigation */}
      {breadcrumb.length > 1 && (
        <Card sx={{ p: 1.5, borderRadius: 2, border: "1px solid #f0ece6" }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:account-supervisor" width={20} sx={{ color: ORO }} />
            <Breadcrumbs separator="›" sx={{ "& .MuiBreadcrumbs-separator": { color: "#ccc" } }}>
              {breadcrumb.map((b, i) => {
                const isLast = i === breadcrumb.length - 1;
                return isLast ? (
                  <Typography key={b.user_id} sx={{ fontSize: "0.82rem", fontWeight: 700, color: ORO }}>{b.username}</Typography>
                ) : (
                  <Link key={b.user_id} underline="hover" sx={{ fontSize: "0.82rem", fontWeight: 600, color: ESPRESSO, cursor: "pointer" }}
                    onClick={() => handleBreadcrumb(i === 0 ? null : b.user_id)}>
                    {i === 0 ? (isIt ? "Il mio team" : "My team") : b.username}
                  </Link>
                );
              })}
            </Breadcrumbs>
            <Box sx={{ flex: 1 }} />
            <Button size="small" startIcon={<Iconify icon="mdi:arrow-left" width={16} />}
              onClick={() => handleBreadcrumb(null)}
              sx={{ textTransform: "none", fontSize: "0.75rem", color: ESPRESSO }}>
              {isIt ? "Torna al mio team" : "Back to my team"}
            </Button>
          </Stack>
        </Card>
      )}

      {/* Mini-card riepilogo */}
      <Grid container spacing={1.5}>
        {[
          { icon: "mdi:account-group", label: isIt ? "Totale Membri" : "Total Members", value: stats.total, color: ESPRESSO },
          { icon: "mdi:account-tie", label: isIt ? "Promoter Attivi" : "Active Promoters", value: `${stats.promoters}`, sub: `${stats.active7d} ${isIt ? "attivi 7gg" : "active 7d"}`, color: ORO },
          { icon: "mdi:account-heart", label: isIt ? "Clienti" : "Customers", value: stats.customers, sub: `${stats.smartship} smartship`, color: "#4CAF50" },
          { icon: "mdi:shield-check", label: isIt ? "Tasso Ritenzione" : "Retention Rate", value: `${stats.retention}%`, color: stats.retention >= 70 ? "#4CAF50" : stats.retention >= 50 ? "#EF9F27" : "#E24B4A" },
        ].map((s, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Card sx={{ p: 2, borderRadius: 3, border: "1px solid #f0ece6" }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(s.color, 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Iconify icon={s.icon} width={20} sx={{ color: s.color }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: s.color }}>{s.value}</Typography>
                  <Typography sx={{ fontSize: "0.6rem", color: "#7A6A5C" }}>{s.label}</Typography>
                  {s.sub && <Typography sx={{ fontSize: "0.55rem", color: "#aaa" }}>{s.sub}</Typography>}
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

    <Card sx={{ borderRadius: 3, border: "1px solid #f0ece6", overflow: "hidden" }}>
      {/* Header with filters */}
      <Box sx={{ p: 2, borderBottom: "1px solid #f0ece6" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ md: "center" }}>
          <Typography sx={{ fontWeight: 700, color: ESPRESSO, fontSize: "1rem", mr: 2 }}>
            Team & Clienti
            <Chip label={filtered.length} size="small" sx={{ ml: 1, height: 20, fontSize: "0.65rem", bgcolor: alpha(ORO, 0.1), color: ORO, fontWeight: 700 }} />
          </Typography>
          <TextField size="small" placeholder="Cerca..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <Iconify icon="mdi:magnify" width={18} sx={{ color: "#aaa", mr: 0.5 }} /> }}
            sx={{ width: 200, "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "0.8rem" } }} />
          <TextField select size="small" value={filter} onChange={(e) => setFilter(e.target.value)}
            sx={{ width: 180, "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "0.8rem" } }}>
            {FILTERS.map((f) => <MenuItem key={f.value} value={f.value} sx={{ fontSize: "0.8rem" }}>{isIt ? f.label : f.labelEn}</MenuItem>)}
          </TextField>
          <TextField select size="small" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}
            sx={{ width: 130, "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "0.8rem" } }}>
            <MenuItem value="all" sx={{ fontSize: "0.8rem" }}>{isIt ? "Tutti i livelli" : "All levels"}</MenuItem>
            {[1,2,3,4,5,6,7,8,9,10].map((lv) => <MenuItem key={lv} value={String(lv)} sx={{ fontSize: "0.8rem" }}>{isIt ? `Livello ${lv}` : `Level ${lv}`}</MenuItem>)}
          </TextField>
          <Box sx={{ flex: 1 }} />
          <Stack direction="row" spacing={2}>
            {[
              { label: "PQV", value: totals.pqv, color: ORO },
              { label: "TV", value: totals.tv, color: "#4CAF50" },
              { label: "GV", value: totals.gv, color: "#2196F3" },
              { label: "Rev", value: totals.revenue, color: "#FF9800", prefix: "€" },
            ].map((t) => (
              <Box key={t.label} sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.6rem", color: "#aaa", textTransform: "uppercase" }}>{t.label}</Typography>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: t.color }}>{t.prefix || ""}{t.value.toFixed(0)}</Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableCell key={col.id} sx={{ fontWeight: 700, fontSize: "0.7rem", color: "#7A6A5C", bgcolor: "#fafafa", width: col.width, whiteSpace: "nowrap" }}
                  align={col.numeric ? "right" : "left"}>
                  {col.noSort ? (isIt ? col.label : col.labelEn) : (
                    <TableSortLabel active={orderBy === col.id} direction={orderBy === col.id ? order : "asc"} onClick={() => handleSort(col.id)}>
                      {isIt ? col.label : col.labelEn}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((m) => (
              <React.Fragment key={m.user_id}>
                <TableRow hover onClick={() => setExpanded(expanded === m.user_id ? null : m.user_id)}
                  sx={{ bgcolor: getLevelBg(m.level), cursor: "pointer", "&:hover": { bgcolor: alpha(ORO, 0.06) } }}>
                  <TableCell sx={{ fontSize: "0.75rem", fontWeight: 700, color: ORO }}>{m.level}</TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={0.8}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: getActivityColor(m.days_inactive), flexShrink: 0 }} />
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: ESPRESSO }}>{m.name || "—"}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", color: "#7A6A5C" }}>{m.username}</TableCell>
                  <TableCell>
                    <Chip label={m.type === "promoter" ? "P" : "C"} size="small"
                      sx={{ height: 20, fontSize: "0.6rem", fontWeight: 700, width: 28,
                        bgcolor: m.type === "promoter" ? alpha(ORO, 0.1) : alpha("#4CAF50", 0.1),
                        color: m.type === "promoter" ? ORO : "#4CAF50" }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", color: ESPRESSO }}>{m.rank}</TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.75rem", fontWeight: 600, color: m.pqv > 0 ? ESPRESSO : "#ccc" }}>{m.pqv}</TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.75rem", fontWeight: 600, color: m.tv > 0 ? "#4CAF50" : "#ccc" }}>{m.tv}</TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.75rem", fontWeight: 600, color: m.gv > 0 ? "#2196F3" : "#ccc" }}>{m.gv}</TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.75rem", fontWeight: 600, color: m.revenue > 0 ? "#FF9800" : "#ccc" }}>€{m.revenue}</TableCell>
                  <TableCell>
                    {m.smartship ? <Iconify icon="mdi:check-circle" width={16} sx={{ color: "#4CAF50" }} /> : <Iconify icon="mdi:close-circle-outline" width={16} sx={{ color: "#ddd" }} />}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.68rem", color: m.days_inactive > 30 ? "#E24B4A" : m.days_inactive > 15 ? "#EF9F27" : "#7A6A5C" }}>
                    {m.last_order ? new Date(m.last_order).toLocaleDateString("it-IT", { day: "2-digit", month: "short" }) : "—"}
                    {m.days_inactive > 0 && <span style={{ fontSize: "0.6rem", marginLeft: 4 }}>({m.days_inactive}d)</span>}
                  </TableCell>
                  <TableCell sx={{ width: 40, p: 0.5 }}>
                    {m.type === "promoter" && (
                      <Tooltip title={isIt ? "Vedi il suo team" : "View their team"}>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleViewTeam(m.user_id); }}
                          sx={{ color: ORO, "&:hover": { bgcolor: alpha(ORO, 0.1) } }}>
                          <Iconify icon="mdi:account-arrow-right" width={18} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
                {/* Expanded detail row */}
                <TableRow>
                  <TableCell colSpan={12} sx={{ p: 0, border: 0 }}>
                    <Collapse in={expanded === m.user_id} unmountOnExit>
                      <Box sx={{ p: 2, bgcolor: "#fafafa", borderBottom: "1px solid #eee" }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: "#7A6A5C", mb: 0.5, textTransform: "uppercase" }}>
                              {isIt ? "Dettagli" : "Details"}
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: ESPRESSO }}>ID: {m.user_id}</Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: ESPRESSO }}>{isIt ? "Iscritto il" : "Joined"}: {m.joined_at ? new Date(m.joined_at).toLocaleDateString("it-IT") : "—"}</Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: ESPRESSO }}>{isIt ? "Livello" : "Level"}: {m.level}° {isIt ? "linea" : "line"}</Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: "#7A6A5C", mb: 0.5, textTransform: "uppercase" }}>
                              {isIt ? "Volumi Mese" : "Monthly Volumes"}
                            </Typography>
                            <Stack spacing={0.8}>
                              {[
                                { label: "PQV", value: m.pqv, color: ORO },
                                { label: "TV", value: m.tv, color: "#4CAF50" },
                                { label: "GV", value: m.gv, color: "#2196F3" },
                              ].map((v) => (
                                <Box key={v.label}>
                                  <Stack direction="row" justifyContent="space-between" mb={0.2}>
                                    <Typography sx={{ fontSize: "0.7rem", color: "#7A6A5C" }}>{v.label}</Typography>
                                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: v.color }}>{v.value}</Typography>
                                  </Stack>
                                  <LinearProgress variant="determinate" value={Math.min(100, v.value / 2)} sx={{ height: 4, borderRadius: 2, bgcolor: alpha(v.color, 0.1), "& .MuiLinearProgress-bar": { bgcolor: v.color, borderRadius: 2 } }} />
                                </Box>
                              ))}
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: "#7A6A5C", mb: 0.5, textTransform: "uppercase" }}>
                              {isIt ? "Stato" : "Status"}
                            </Typography>
                            <Stack direction="row" spacing={0.8} flexWrap="wrap" gap={0.5}>
                              <Chip size="small" label={m.type === "promoter" ? "Promoter" : "Customer"} sx={{ height: 22, fontSize: "0.65rem", bgcolor: m.type === "promoter" ? alpha(ORO, 0.1) : alpha("#4CAF50", 0.1), color: m.type === "promoter" ? ORO : "#4CAF50" }} />
                              <Chip size="small" label={m.rank} sx={{ height: 22, fontSize: "0.65rem", bgcolor: alpha("#2196F3", 0.1), color: "#2196F3" }} />
                              {m.smartship && <Chip size="small" icon={<Iconify icon="mdi:refresh-circle" width={14} />} label="Smartship" sx={{ height: 22, fontSize: "0.65rem", bgcolor: alpha("#8BC34A", 0.1), color: "#8BC34A" }} />}
                              {m.days_inactive > 30 && <Chip size="small" label={`${isIt ? "Inattivo" : "Inactive"} ${m.days_inactive}d`} sx={{ height: 22, fontSize: "0.65rem", bgcolor: alpha("#E24B4A", 0.1), color: "#E24B4A" }} />}
                            </Stack>
                            <Typography sx={{ fontSize: "0.72rem", color: ESPRESSO, mt: 1 }}>
                              Revenue: <b style={{ color: "#FF9800" }}>€{m.revenue}</b>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={12} sx={{ textAlign: "center", py: 4, color: "#aaa" }}>{isIt ? "Nessun risultato" : "No results"}</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
    </Stack>
  );
};

export default TeamUnified;
