import { Box, Card, Dialog, DialogContent, DialogTitle, IconButton, Stack, Tab, TableCell, TableRow, Tabs, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import { PATH_DASHBOARD } from "src/routes/paths";
import useGetList from "./hooks/use-get-list";
import useFilter from "./hooks/use-filter";
import Scrollbar from "src/components/Scrollbar";
import DataFilter from "./components/dataFilter";
import Iconify from "src/components/Iconify";
import TeamUnified from "src/pages/user/reports/team-unified";
import IncomeReport from "src/pages/user/income-report";
import QualificationsReport from "src/pages/user/reports/qualifications";

const ORO = "#B8963B";

const REPORT_TABS = [
  { key: "income", label: "Guadagni", icon: "mdi:cash-multiple" },
  { key: "team", label: "Team", icon: "mdi:account-group" },
  { key: "qualifications", label: "Qualifiche", icon: "mdi:trophy-variant" },
];

const headers = [
  "genealogy.list.table.no",
  "genealogy.list.table.u_name",
  "genealogy.list.table.doj",
  "genealogy.list.table.level",
  "",
];

const List = () => {
  const methods = useFilter();
  const filter = methods.watch();
  const { state, fetchData, rowStart, ...rest } = useGetList(filter);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportTab, setReportTab] = useState(0);

  const { data, ...dataProps } = state;

  const onFilter = methods.handleSubmit(
    async (inputData) => await fetchData(1, inputData)
  );

  return (
    <Page title="genealogy.list.title">
      <Box>
        <HeaderBreadcrumbs
          heading="genealogy.list.title"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "genealogy.list.title" },
          ]}
        />
        <Card sx={{ p: 2 }}>
          <DataFilter methods={methods} onFilter={onFilter} />
          <Scrollbar>
            <DataHandlerTable headers={headers} dataProps={dataProps}>
              <Map
                list={data}
                render={({ user_id, username, DOJ, level }, i) => {
                  return (
                    <TableRow>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{username}</TableCell>
                      <TableCell>
                        <ParseDate date={DOJ} />
                      </TableCell>
                      <TableCell>{level}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Vedi Report (Guadagni / Team / Qualifiche)">
                          <IconButton
                            size="small"
                            onClick={() => { setReportTarget({ user_id, username }); setReportTab(0); }}
                            sx={{ color: ORO, "&:hover": { bgcolor: "rgba(184, 150, 59, 0.08)" } }}
                          >
                            <Iconify icon="mdi:chart-timeline-variant-shimmer" width={20} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                }}
              />
            </DataHandlerTable>
          </Scrollbar>
        </Card>
      </Box>
      <PaginationButtons {...rest} />

      <Dialog
        open={Boolean(reportTarget)}
        onClose={() => setReportTarget(null)}
        maxWidth="xl"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, height: "92vh" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0ece6", py: 1.5 }}>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#2C1A0E" }}>
            Report — {reportTarget?.username}
          </Typography>
          <IconButton onClick={() => setReportTarget(null)} size="small">
            <Iconify icon="mdi:close" width={20} />
          </IconButton>
        </DialogTitle>
        <Tabs
          value={reportTab}
          onChange={(_, v) => setReportTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "1px solid #f0ece6", px: 2,
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.85rem", minHeight: 44 },
            "& .Mui-selected": { color: ORO },
            "& .MuiTabs-indicator": { bgcolor: ORO, height: 3, borderRadius: 2 },
          }}
        >
          {REPORT_TABS.map((tb) => (
            <Tab key={tb.key} label={
              <Stack direction="row" alignItems="center" spacing={0.8}>
                <Iconify icon={tb.icon} width={16} />
                <span>{tb.label}</span>
              </Stack>
            } />
          ))}
        </Tabs>
        <DialogContent sx={{ p: 2, bgcolor: "#FAF6EF", overflow: "auto" }}>
          {reportTarget && reportTab === 0 && (
            <IncomeReport key={`income-${reportTarget.user_id}`} initialViewAs={reportTarget.user_id} />
          )}
          {reportTarget && reportTab === 1 && (
            <TeamUnified key={`team-${reportTarget.user_id}`} initialViewAs={reportTarget.user_id} />
          )}
          {reportTarget && reportTab === 2 && (
            <QualificationsReport key={`qual-${reportTarget.user_id}`} initialViewAs={reportTarget.user_id} />
          )}
        </DialogContent>
      </Dialog>
    </Page>
  );
};

export default List;
