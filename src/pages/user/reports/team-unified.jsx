import { Box, Card, Chip, CircularProgress, IconButton, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";

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
];

const TeamUnified = () => {
  const { t, i18n } = useTranslation();
  const isIt = i18n.language?.startsWith("it");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("level");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    (async () => {
      try {
        const { data: r } = await axiosInstance.get("api/wp/reports/team-unified");
        setData(r?.data || []);
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, []);

  const handleSort = (col) => {
    if (orderBy === col) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(col);
      setOrder("desc");
    }
  };

  // Filter
  let filtered = data;
  if (filter === "promoter") filtered = filtered.filter((m) => m.type === "promoter");
  if (filter === "customer") filtered = filtered.filter((m) => m.type === "customer");
  if (filter === "smartship") filtered = filtered.filter((m) => m.smartship);
  if (filter === "inactive") filtered = filtered.filter((m) => m.days_inactive >= 30 || m.days_inactive === null);
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((m) => m.username?.toLowerCase().includes(s) || m.name?.toLowerCase().includes(s));
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    let va = a[orderBy], vb = b[orderBy];
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

  if (loading) return <Box sx={{ textAlign: "center", py: 6 }}><CircularProgress sx={{ color: ORO }} /></Box>;

  return (
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
                  <TableSortLabel active={orderBy === col.id} direction={orderBy === col.id ? order : "asc"} onClick={() => handleSort(col.id)}>
                    {isIt ? col.label : col.labelEn}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((m) => (
              <TableRow key={m.user_id} hover sx={{ "&:hover": { bgcolor: alpha(ORO, 0.03) } }}>
                <TableCell sx={{ fontSize: "0.75rem", fontWeight: 700, color: ORO }}>{m.level}</TableCell>
                <TableCell sx={{ fontSize: "0.75rem", fontWeight: 600, color: ESPRESSO }}>{m.name || "—"}</TableCell>
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
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={11} sx={{ textAlign: "center", py: 4, color: "#aaa" }}>Nessun risultato</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default TeamUnified;
