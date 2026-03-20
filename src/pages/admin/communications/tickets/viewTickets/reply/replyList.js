import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// @mui
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  Link,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
// hooks
import useImpersonate from "src/hooks/useImpersonate";
// utils
// components
import ReactQuill from "react-quill";
import Iconify from "src/components/Iconify";
import TableMenu from "src/components/tableMenu";
import Ternary from "src/components/ternary";

import Translate from "src/components/translate";
import { PATH_DASHBOARD } from "src/routes/paths";
import UpdateOwner from "./UpdateOwner";

// ----------------------------------------------------------------------

const ReplyList = ({ ticketData, fetchTicket }) => {
  const {
    support_ticket_replies: replies,
    user,
    ticket_number,
  } = ticketData || {};

  const [selectedId, setSelectedId] = useState(null);
  const [openMenu, setOpenMenuActions] = useState(null);
  const [openDialogue, setOpenDialogue] = useState(false);
  const handleOpenMenu = (userId) => (event) => {
    setSelectedId(userId);
    setOpenMenuActions(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };
  const handleOpenDialogue = () => {
    setOpenDialogue(true);
    handleCloseMenu();
  };
  const onCloseDialogue = () => {
    setOpenDialogue(false);
  };
  const onImpersonate = useImpersonate(selectedId);
  return (
    <div>
      <Card>
        <CardHeader
          disableTypography
          avatar={
            <Avatar alt="sample" src={user?.user_profile?.profile_image}>
              {user?.username?.slice(0, 1)}
            </Avatar>
          }
          title={
            <Link
              to="#"
              variant="subtitle2"
              color="text.primary"
              component={RouterLink}
            >
              {ticketData?.user?.username}
            </Link>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ display: "block", color: "text.secondary" }}
            >
              {/* march 12 2022 - 03:29am */}
            </Typography>
          }
          action={
            <IconButton onClick={handleOpenMenu(ticketData.user_id)}>
              <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
            </IconButton>
          }
        />
        <Stack spacing={3} sx={{ p: 3 }}>
          <ReactQuill
            sx={{ p: 2 }}
            value={ticketData.description}
            theme="bubble"
            modules={{
              toolbar: null,
            }}
            readOnly
          />
          <Ternary
            when={Boolean(ticketData.attachments)}
            then={
              <Box>
                <Button
                  LinkComponent="a"
                  href={ticketData.attachments}
                  sx={{ textAlign: "left" }}
                  target="_blank"
                  size="small"
                  startIcon={<Iconify icon={"carbon:view"} />}
                >
                  <u>
                    <Translate>help_center.view.view_attachments</Translate>
                  </u>
                </Button>
              </Box>
            }
          />
        </Stack>
        <Stack spacing={3} sx={{ p: 3 }}>
          {replies?.map((data) => {
            const { body, title, user, created_at } = data;
            const date = new Date(created_at);
            const time = date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            });
            const day = date.toLocaleDateString("en-GB", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const isSuperAdmin = Boolean(user?.is_super_admin);

            return (
              <Stack spacing={1.5}>
                <Stack key="" direction="row" spacing={2}>
                  {!isSuperAdmin && (
                    <Avatar
                      alt="sample"
                      src={user?.user_profile?.profile_image}
                    >
                      {user?.username?.slice(0, 1)}
                    </Avatar>
                  )}
                  <Paper
                    sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ sm: "center" }}
                      justifyContent="space-between"
                      sx={{ mb: 0.5 }}
                    >
                      {!isSuperAdmin && (
                        <Typography variant="subtitle2">
                          {user?.username}
                        </Typography>
                      )}
                      <Typography
                        variant="caption"
                        sx={{ color: "text.disabled" }}
                      >
                        {day} - {time}
                      </Typography>
                      {isSuperAdmin && (
                        <Typography variant="subtitle2">
                          {user?.username}
                        </Typography>
                      )}
                    </Stack>
                    {isSuperAdmin ? (
                      <Typography
                        sx={{ textAlign: isSuperAdmin ? "right" : "initial" }}
                        variant="subtitle2"
                      >
                        {title}
                      </Typography>
                    ) : (
                      <Typography variant="subtitle2">{title}</Typography>
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        float: isSuperAdmin ? "right" : "initial",
                        textAlign: isSuperAdmin ? "right" : "initial",
                      }}
                    >
                      <ReactQuill
                        sx={{ p: 2 }}
                        value={body}
                        theme="bubble"
                        modules={{
                          toolbar: null,
                        }}
                        readOnly
                      />
                    </Typography>
                  </Paper>
                  {isSuperAdmin && (
                    <Avatar
                      alt="sample"
                      src={user?.user_profile?.profile_image}
                    >
                      {user?.username?.slice(0, 1)}
                    </Avatar>
                  )}
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Card>
      <TableMenu onClose={handleCloseMenu} open={openMenu}>
        <MenuItem onClick={onImpersonate} sx={{ color: "default.main" }}>
          <Iconify icon={"ant-design:user-switch-outlined"} />
          <Translate>help_center.view.actions.impersonate</Translate>
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.members.member_profile}/${selectedId}`}
          sx={{ color: "default.main" }}
        >
          <Iconify icon={"ant-design:user-outlined"} />
          <Translate>help_center.view.actions.edit</Translate>
        </MenuItem>
      </TableMenu>
      <UpdateOwner
        openDialogue={openDialogue}
        onCloseDialogue={onCloseDialogue}
        fetchTicket={fetchTicket}
        selectedId={selectedId}
        ticketNumber={ticket_number}
      />
    </div>
  );
};

export default ReplyList;
