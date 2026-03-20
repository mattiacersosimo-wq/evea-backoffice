import { Chip, Grid, Stack } from "@mui/material";
import { useTheme } from "@mui/styles";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Translate from "src/components/translate";
import { PATH_DASHBOARD, PATH_USER } from "src/routes/paths";
import TicketAbout from "./about";
import DatesCard from "./dates";
import useFetchTicketView from "./hooks/useFetchTicketView";
import ReplyForm from "./reply/replyForm";
import ReplyList from "./reply/replyList";

const Index = () => {
  const { data, fetchData } = useFetchTicketView();

  const { palette } = useTheme();
  return (
    <Page title="support_tickets.view.title">
      <HeaderBreadcrumbs
        sx={{ pl: "1" }}
        heading="support_tickets.view.title"
        links={[
          { name: "global.dashboard", href: PATH_DASHBOARD.root },
          {
            name: "support_tickets.title",
            href: PATH_USER.helpCenter.createTicket.subCategory(),
          },
          {
            name: "support_tickets.view.title",
            href: PATH_DASHBOARD.settings.network,
          },
        ]}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={10}>
          <Chip
            label={
              <>
                <Translate>support_tickets.view.pill</Translate>:{" "}
                <b>{data.ticket_number}</b>
              </>
            }
            variant="contained"
            sx={{ backgroundColor: palette.primary.main, color: "#fff" }}
          />
        </Grid>
        <Grid item xs={12} md={2}></Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <DatesCard data={data} />
            <TicketAbout data={data} />
          </Stack>
        </Grid>
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <ReplyList data={data} />
            <ReplyForm reload={fetchData} />
          </Stack>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Index;
