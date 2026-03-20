import { Box, Grid, Stack, Typography } from "@mui/material";
import Translate from "src/components/translate";
import { isMenuActive } from "src/utils/actionProtector";
import TicketAbout from "./about";
import TicketButton from "./buttonsTickets";
import DatesCard from "./dates";
import useGetTickets from "./hook/useGetTickets";
import ReplyForm from "./reply/replyForm";
import ReplyList from "./reply/replyList";

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    edit: test("edit-ticket"),
    updateStatus: test("update-ticket-status"),
    replyTicket: test("reply-ticket"),
  };
};

const Index = () => {
  const { ticketData, fetchTicket } = useGetTickets();
  const { ticket_number } = ticketData || {};
  const permission = genStatus(
    "nav.communication.title",
    "nav.communication.help_center"
  );

  return (
    <>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Typography>
              <Translate>help_center.view.tkt_id</Translate>:{" "}
              <b>{ticket_number}</b>
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <TicketButton
              ticketData={ticketData}
              fetchTicket={fetchTicket}
              showEdit={permission.edit}
              showUpdateButton={permission.updateStatus}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <DatesCard ticketData={ticketData} />
              <TicketAbout ticketData={ticketData} showEdit={permission.edit} />
            </Stack>
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <ReplyList ticketData={ticketData} fetchTicket={fetchTicket} />
              <ReplyForm
                ticketData={ticketData}
                fetchTicket={fetchTicket}
                showReplyTicket={permission.replyTicket}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Index;
