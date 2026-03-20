import moment from "moment";
import PropTypes from "prop-types";
import React from "react";

// @mui
import { Card, CardHeader, Link, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// components
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import { capitalCase } from "change-case";

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

const Index = ({ data }) => {
  return (
    <div>
      <Card>
        <Stack spacing={2} sx={{ p: 3 }}>
          <Stack direction="row">
            <IconStyle icon={"pajamas:status"} />
            <Typography variant="body2">
              <Translate>support_tickets.view.about.status</Translate> &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {capitalCase(data.status || "")}
              </Link>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon={"material-symbols:priority"} />
            <Typography variant="body2">
              <Translate>support_tickets.view.about.priority</Translate> &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {data.support_ticket_priorities?.name}
              </Link>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon={"bxs:category"} />
            <Typography variant="body2">
              <Translate>support_tickets.view.about.department</Translate>{" "}
              &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {data.support_ticket_departments?.name}
              </Link>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon={"dashicons:email-alt"} />
            <Typography variant="body2">
              <Translate>support_tickets.view.about.email</Translate> &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {data.user?.email}
              </Link>
            </Typography>
          </Stack>
          <Stack direction="row">
            <IconStyle icon={"ic:baseline-category"} />
            <Typography variant="body2">
              <Translate>support_tickets.view.about.category</Translate> &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {data.support_ticket_categories?.name}
              </Link>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon={"bxs:user-pin"} />
            <Typography variant="body2">
              <Translate>support_tickets.view.about.username</Translate> &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {data.user?.username}
              </Link>
            </Typography>
          </Stack>
          {data?.last_response ? (
            <>
              <Stack direction="row">
                <IconStyle icon={"ant-design:message-filled"} />
                <Typography variant="body2">
                  <Translate>support_tickets.view.last</Translate> &nbsp;
                  <Link
                    component="span"
                    variant="subtitle2"
                    color="text.primary"
                  >
                    {data.last_response}
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
