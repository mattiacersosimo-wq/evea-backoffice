import { IconButton, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link, useParams } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import { PATH_DASHBOARD } from "src/routes/paths";
import StatusButton from "./components/status-button";

const Index = ({ ticketData, fetchTicket, showUpdateButton, showEdit }) => {
  const ticketStatus = ticketData.status || "";
  const { id } = useParams();

  const { breakpoints } = useTheme();
  const d_sm = useMediaQuery(breakpoints.down("sm"));

  return (
    <Stack
      direction={d_sm ? "row-reverse" : "row"}
      spacing={2}
      justifyContent={d_sm ? "space-between" : "flex-end"}
    >
      <Ternary
        when={showEdit}
        then={
          <IconButton
            component={Link}
            size="medium"
            to={PATH_DASHBOARD.communication.edit(id)}
            sx={{
              color: "primary.main",
            }}
          >
            <Iconify icon="bx:edit" />
          </IconButton>
        }
      />

      <Ternary
        when={showUpdateButton}
        then={
          <StatusButton fetchTicket={fetchTicket} ticketStatus={ticketStatus} />
        }
      />
    </Stack>
  );
};

export default Index;
