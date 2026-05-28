import { useState } from "react";
import { Box, Card, Tabs, Tab, Typography, Stack } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Iconify from "src/components/Iconify";

import { PATH_USER } from "src/routes/paths";
import DocCard from "./DocCard";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const GRIGIO = "#7A6A5C";

const EnglishEmpty = () => (
  <Card sx={{ p: 5, textAlign: "center", border: "1px dashed #e0d8c8" }}>
    <Iconify icon="mdi:translate" width={48} sx={{ color: ORO, opacity: 0.6 }} />
    <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: ESPRESSO, mt: 1.5 }}>
      English documents coming soon
    </Typography>
    <Typography sx={{ fontSize: "0.85rem", color: GRIGIO, mt: 0.5, maxWidth: 480, mx: "auto" }}>
      We are translating our official documents. English versions will be available shortly. For now, please refer to the Italian section.
    </Typography>
  </Card>
);

const Index = () => {
  const [lang, setLang] = useState("it");

  return (
    <Page title="help_center.document.title">
      <Box>
        <HeaderBreadcrumbs
          heading="help_center.document.title"
          links={[
            { name: "global.dashboard", href: PATH_USER.root },
            { name: "help_center.document.title" },
          ]}
        />
        <Card sx={{ mb: 2, borderRadius: 2 }}>
          <Tabs
            value={lang}
            onChange={(_, v) => setLang(v)}
            sx={{
              "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
              "& .Mui-selected": { color: ORO + " !important" },
              "& .MuiTabs-indicator": { backgroundColor: ORO },
            }}
          >
            <Tab value="it" label={<Stack direction="row" alignItems="center" spacing={1}><span role="img" aria-label="it">🇮🇹</span><span>Italiano</span></Stack>} />
            <Tab value="en" label={<Stack direction="row" alignItems="center" spacing={1}><span role="img" aria-label="en">🇬🇧</span><span>English</span></Stack>} />
          </Tabs>
        </Card>
        {lang === "it" ? <DocCard /> : <EnglishEmpty />}
      </Box>
    </Page>
  );
};
export default Index;
