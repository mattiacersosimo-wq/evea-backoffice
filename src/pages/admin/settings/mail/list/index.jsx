import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import { PATH_DASHBOARD } from "src/routes/paths";
import Row from "./components/row";
import useGetTemplates from "./hooks/use-get-templates";

const headers = [
  "email_settings.table.no",
  "email_settings.table.name",
  "email_settings.table.template_id",
  "email_settings.table.language",
  "email_settings.table.subject",
  "email_settings.table.edit_template",
];

const Mail = () => {
  const { state } = useGetTemplates();

  const { data, ...dataProps } = state;

  return (
    <Page title="email_settings.title">
      <Box>
        <HeaderBreadcrumbs
          heading="email_settings.title"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "email_settings.title" },
          ]}
        />

        <DataHandlerTable headers={headers} dataProps={dataProps}>
          <Map
            list={data}
            render={(item, i) => <Row data={item} rowNumber={i + 1} />}
          />
        </DataHandlerTable>
      </Box>
    </Page>
  );
};

export default Mail;
