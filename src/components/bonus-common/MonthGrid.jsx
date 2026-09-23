import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";

// MonthGrid: griglia mesi consecutivi con status pass/fail.
// Usato da goMVP, RockSolid, Ritual per mostrare "mesi qualifica" M1..Mn.
//
// Props:
// - months: array di boolean (true = mese completato, false = fallito) oppure
//           oggetto {M1: true, M2: false, ...} — auto-normalizzato ad array
// - title: string, label sopra la griglia (default "Stato qualifica mensile")
// - okColor: colore stato completato (default verde)
// - failColor: colore stato fallito (default rosso tenue)
// - cols: numero colonne per riga (default 4, xs={3})

const OK_COLOR_DEFAULT = "#43A047";
const FAIL_COLOR_DEFAULT = "#E53935";

const MonthGrid = ({
  months = [],
  title = "Stato qualifica mensile",
  okColor = OK_COLOR_DEFAULT,
  failColor = FAIL_COLOR_DEFAULT,
  cols = 4,
}) => {
  const entries = Array.isArray(months) ? months : (months ? Object.values(months) : []);
  if (!entries.length) return null;

  const xsSize = Math.max(1, Math.floor(12 / cols));

  return (
    <Box sx={{ mt: 2 }}>
      {title && (
        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#2C1A0E", mb: 1 }}>
          {title}
        </Typography>
      )}
      <Grid container spacing={0.5}>
        {entries.map((ok, index) => {
          const done = Boolean(ok);
          const color = done ? okColor : failColor;
          return (
            <Grid item xs={xsSize} key={index}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={0.5}
                sx={{
                  py: 0.8,
                  borderRadius: 1.5,
                  bgcolor: done ? alpha(color, 0.1) : alpha(color, 0.06),
                  border: `1px solid ${done ? alpha(color, 0.2) : alpha(color, 0.1)}`,
                }}
              >
                <Iconify
                  icon={done ? "mdi:check-circle" : "mdi:close-circle-outline"}
                  width={14}
                  sx={{ color: done ? color : "#bbb" }}
                />
                <Typography sx={{ fontSize: "0.68rem", fontWeight: 600, color: done ? color : "#999" }}>
                  M{index + 1}
                </Typography>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default MonthGrid;
