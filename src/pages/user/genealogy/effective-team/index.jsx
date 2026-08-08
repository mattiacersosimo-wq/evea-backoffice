import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

/**
 * Pagina "Il tuo team effettivo" (dynamic compression view).
 *
 * Mostra al promoter la sua rete "effettiva" ai fini bonus (invece del tree
 * fisico classico): customer profondi nella zona (DSB), promoter compressed
 * come 1a/2a/3a linea (ISB).
 *
 * Dati da: GET /api/dashboard/compression-overview
 */
export default function EffectiveTeam() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    axiosInstance
      .get("api/wp/dashboard/compression-overview")
      .then((r) => setData(r.data))
      .catch((err) => console.error("compression-overview error", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Page title="Il tuo team effettivo">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Il tuo team effettivo"
          links={[
            { name: "Dashboard", href: "/user/dashboard" },
            { name: "Genealogia", href: "/user/genealogy/sponsor" },
            { name: "Team effettivo" },
          ]}
        />

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Questa vista mostra chi contribuisce realmente ai tuoi bonus (DSB e ISB),
            includendo <strong>clienti in profondità</strong> e{" "}
            <strong>incaricati che nel tree fisico appaiono più giù</strong> ma
            che per calcolo commissioni sono considerati tuoi diretti (dynamic compression).
          </Typography>
        </Box>

        {loading && (
          <Stack alignItems="center" py={8}>
            <CircularProgress />
          </Stack>
        )}

        {!loading && data && (
          <>
            <SummaryCards summary={data.summary} />

            <Card sx={{ mt: 3 }}>
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
              >
                <Tab label={`Clienti nella zona (${data.summary.total_zone_customers})`} />
                <Tab label={`1ª linea (${data.summary.total_first_line})`} />
                <Tab label={`2ª linea (${data.summary.total_line_2})`} />
                <Tab label={`3ª linea (${data.summary.total_line_3})`} />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {tab === 0 && <ZoneCustomersList customers={data.zone_customers} />}
                {tab === 1 && <PromotersList promoters={data.first_line_promoters} showCompressed />}
                {tab === 2 && <PromotersList promoters={data.line_2_promoters} />}
                {tab === 3 && <PromotersList promoters={data.line_3_promoters} />}
              </Box>
            </Card>
          </>
        )}
      </Container>
    </Page>
  );
}

function SummaryCards({ summary }) {
  const items = [
    {
      label: "Clienti nella tua zona",
      value: summary.total_zone_customers,
      icon: "eva:people-fill",
      color: "#B8963B",
      hint: "Generano DSB per te (15% o 30% con Starter Pack)",
    },
    {
      label: "Prime linee (compressed)",
      value: summary.total_first_line,
      icon: "eva:star-fill",
      color: "#2C1A0E",
      hint: `${summary.compressed_first_line_count} di questi sono compressed (non visibili nel tree fisico)`,
    },
    {
      label: "Seconde linee",
      value: summary.total_line_2,
      icon: "eva:layers-fill",
      color: "#7A6A5C",
      hint: "Contribuiscono al tuo ISB livello 2 (3%)",
    },
    {
      label: "Terze linee",
      value: summary.total_line_3,
      icon: "eva:layers-outline",
      color: "#7A6A5C",
      hint: "Contribuiscono al tuo ISB livello 3 (3%)",
    },
  ];
  return (
    <Grid container spacing={2}>
      {items.map((it) => (
        <Grid item xs={12} sm={6} md={3} key={it.label}>
          <Card sx={{ p: 2.5, height: "100%" }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1,
                  bgcolor: it.color,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Iconify icon={it.icon} width={24} height={24} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ lineHeight: 1 }}>
                  {it.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {it.label}
                </Typography>
              </Box>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: "block" }}>
              {it.hint}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

function ZoneCustomersList({ customers }) {
  if (customers.length === 0) {
    return (
      <Typography color="text.secondary" align="center" py={4}>
        Nessun cliente nella tua zona al momento.
      </Typography>
    );
  }
  return (
    <Stack spacing={1}>
      {customers.map((c) => (
        <Stack
          key={c.id}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 1.5, bgcolor: "background.neutral", borderRadius: 1 }}
        >
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {c.name || c.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{c.username}
            </Typography>
          </Box>
          {c.is_direct_physical ? (
            <Chip label="Diretto" size="small" color="primary" variant="outlined" />
          ) : (
            <Tooltip title="Cliente in profondità: nella tua zona ma non figlio diretto nell'albero fisico">
              <Chip label="In profondità" size="small" sx={{ bgcolor: "#FFF8F8", color: "#E24B4A" }} />
            </Tooltip>
          )}
        </Stack>
      ))}
    </Stack>
  );
}

function PromotersList({ promoters, showCompressed = false }) {
  if (promoters.length === 0) {
    return (
      <Typography color="text.secondary" align="center" py={4}>
        Nessun promoter a questo livello.
      </Typography>
    );
  }
  return (
    <Stack spacing={1}>
      {promoters.map((p) => (
        <Stack
          key={p.id}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 1.5, bgcolor: "background.neutral", borderRadius: 1 }}
        >
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {p.name || p.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{p.username}
            </Typography>
          </Box>
          {showCompressed && p.is_compressed && (
            <Tooltip title={`Compressed da livello fisico ${p.physical_depth} → 1ª linea grazie a dynamic compression`}>
              <Chip
                label={`compressed L${p.physical_depth}`}
                size="small"
                sx={{ bgcolor: "#fff8ec", color: "#B8963B" }}
              />
            </Tooltip>
          )}
        </Stack>
      ))}
    </Stack>
  );
}
