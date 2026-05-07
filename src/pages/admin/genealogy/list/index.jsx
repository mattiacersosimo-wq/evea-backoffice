import { Box, Card, Dialog, DialogContent, DialogTitle, IconButton, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
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
import AdminTeamReport from "src/components/AdminTeamReport";

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
                        <Tooltip title="Report Team">
                          <IconButton
                            size="small"
                            onClick={() => setReportTarget({ user_id, username })}
                            sx={{ color: "#B8963B", "&:hover": { bgcolor: "rgba(184, 150, 59, 0.08)" } }}
                          >
                            <Iconify icon="mdi:account-group-outline" width={20} />
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
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0ece6" }}>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#2C1A0E" }}>
            Report Team — {reportTarget?.username}
          </Typography>
          <IconButton onClick={() => setReportTarget(null)} size="small">
            <Iconify icon="mdi:close" width={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2, bgcolor: "#FAF6EF" }}>
          {reportTarget && (
            <AdminTeamReport userId={reportTarget.user_id} username={reportTarget.username} />
          )}
        </DialogContent>
      </Dialog>
    </Page>
  );
};

export default List;
