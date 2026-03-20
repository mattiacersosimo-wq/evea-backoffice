import { Box, Button } from "@mui/material";
import { useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import { PATH_DASHBOARD } from "src/routes/paths";
import Row from "./components/row";
import DefaultTemplate from "./components/update-default-template";
import UpdateDialog from "./components/update-dialog";
import useGetLead from "./hooks/use-get-lead";

const headers = [
  "lead_capture.no",
  "lead_capture.name",
  "lead_capture.email",
  "lead_capture.mobile",
  "lead_capture.created_at",
  "lead_capture.edit",
];

const LeadList = () => {
  const { state, fetchData, rowStart, ...rest } = useGetLead();

  const { data, ...dataProps } = state;

  const [openEdit, setOpenEdit] = useState(null);
  const [defaultTemplate, setOpenDefaultTemplate] = useState(false);

  const closeUpdate = () => {
    setOpenEdit(null);
  };

  const closeEditTemplate = () => {
    setOpenDefaultTemplate(false);
  };
  return (
    <>
      <Page title="lead_capture.lead">
        <HeaderBreadcrumbs
          heading="lead_capture.lead"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.dashboard.root },
            { name: "lead_capture.lead" },
          ]}
          action={
            <Button
              variant="contained"
              onClick={() => {
                setOpenDefaultTemplate(true);
              }}
            >
              Edit Template
            </Button>
          }
        />

        <DataHandlerTable headers={headers} dataProps={dataProps}>
          <Map
            list={data}
            render={(item, i) => (
              <Row
                data={item}
                openUpdate={() => {
                  setOpenEdit(item.id);
                }}
                rowNumber={i + rowStart}
              />
            )}
          />
        </DataHandlerTable>

        <PaginationButtons {...rest} />

        <DefaultTemplate onClose={closeEditTemplate} open={defaultTemplate} />

        <UpdateDialog
          open={openEdit}
          fetchData={fetchData}
          onClose={closeUpdate}
        />
      </Page>
    </>
  );
};

export default LeadList;
