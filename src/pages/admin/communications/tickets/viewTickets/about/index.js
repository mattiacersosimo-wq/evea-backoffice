import {
  Card,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link as RouterLink, useParams } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import { PATH_DASHBOARD } from "src/routes/paths";

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

const Index = ({ ticketData, showEdit }) => {
  const { id } = useParams();

  return (
    <div>
      <Card>
        <Stack spacing={2} sx={{ p: 2 }}>
          <Stack direction="row">
            <IconStyle icon={"pajamas:status"} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <Translate>help_center.view.info_card.status</Translate> &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {ticketData?.status}
              </Link>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon={"material-symbols:priority"} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <Translate>help_center.view.info_card.priority</Translate> &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {ticketData?.support_ticket_priorities?.name}
              </Link>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon={"bxs:category"} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <Translate>help_center.view.info_card.department</Translate>{" "}
              &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {ticketData?.support_ticket_departments?.name}
              </Link>
              <Ternary
                when={showEdit}
                then={
                  <>
                    &nbsp;
                    <Tooltip title="Edit">
                      <IconButton
                        variant="outlined"
                        component={RouterLink}
                        to={PATH_DASHBOARD.communication.edit(id)}
                        state={{ ticketId: ticketData.ticket_number }}
                        size="small"
                      >
                        <Iconify icon={"akar-icons:edit"} />
                      </IconButton>
                    </Tooltip>
                  </>
                }
              />
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon={"dashicons:email-alt"} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <Translate>help_center.view.info_card.email</Translate> &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {ticketData?.user?.email}
              </Link>
            </Typography>
          </Stack>
          <Stack direction="row">
            <IconStyle icon={"ic:baseline-category"} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <Translate>help_center.view.info_card.category</Translate> &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {ticketData?.support_ticket_categories?.name}
              </Link>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon={"bxs:user-pin"} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <Translate>help_center.view.info_card.username</Translate> &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {ticketData?.user?.username}
              </Link>
            </Typography>
          </Stack>

          {ticketData?.last_response ? (
            <>
              <Stack direction="row">
                <IconStyle icon={"ant-design:message-filled"} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <Translate>help_center.view.info_card.last_message</Translate>
                  &nbsp;
                  <Link
                    component="span"
                    variant="subtitle2"
                    color="text.primary"
                  >
                    {ticketData?.last_response}
                  </Link>
                </Typography>
              </Stack>
            </>
          ) : null}
        </Stack>
      </Card>
    </div>
  );
};

export default Index;
