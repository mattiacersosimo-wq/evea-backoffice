import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import ReactQuill from "react-quill";
import { Link as RouterLink } from "react-router-dom";
import Iconify from "src/components/Iconify";
import MyAvatar from "src/components/MyAvatar";
import ParseDate from "src/components/date";
import Ternary from "src/components/ternary";

const ReplyList = ({ data }) => {
  const { palette } = useTheme();
  const { support_ticket_replies: replies } = data;

  const isDark = palette.mode === "dark";

  return (
    <div>
      <Card className="faqAccidn">
        <CardHeader
          disableTypography
          avatar={<MyAvatar />}
          title={
            <Link
              to="#"
              variant="subtitle2"
              color="text.primary"
              component={RouterLink}
            >
              {data.user?.username}
            </Link>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ display: "block", color: "text.secondary" }}
            >
              <ParseDate date={data.created_at} />
            </Typography>
          }
        />
        <Stack spacing={3} sx={{ p: 3 }}>
          <ReactQuill
            value={data.description}
            theme="bubble"
            readOnly
            style={{ color: isDark ? "#fff" : "#000" }}
          />
          <Ternary
            when={Boolean(data.attachments)}
            then={
              <Box>
                <Button
                  LinkComponent="a"
                  href={data.attachments}
                  sx={{ textAlign: "left" }}
                  target="_blank"
                  size="small"
                  startIcon={<Iconify icon={"carbon:view"} />}
                >
                  <u>view attachment</u>
                </Button>
              </Box>
            }
          />
        </Stack>

        <Stack spacing={3} sx={{ p: 3 }}>
          {replies?.map((data) => {
            const { body, title, user, created_at } = data;
            console.log(user?.user_profile?.profile_image);
            const isSuperAdmin = Boolean(user?.is_super_admin);

            return (
              <Stack spacing={1.5}>
                <Stack key="" direction="row" spacing={2}>
                  {isSuperAdmin && (
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
                      {isSuperAdmin && (
                        <Typography variant="subtitle2">
                          {user?.username}
                        </Typography>
                      )}
                      <Typography
                        variant="caption"
                        sx={{ color: "text.disabled" }}
                      >
                        <ParseDate date={created_at} />
                      </Typography>
                      {!isSuperAdmin && (
                        <Typography variant="p">{user?.username}</Typography>
                      )}
                    </Stack>
                    {!isSuperAdmin ? (
                      <Typography
                        sx={{ textAlign: !isSuperAdmin ? "right" : "initial" }}
                        variant="subtitle2"
                      >
                        {title}
                      </Typography>
                    ) : (
                      <Typography variant="subtitle2">{title}</Typography>
                    )}
                    <Typography
                      variant="p"
                      sx={{
                        color: "text.secondary",
                        float: !isSuperAdmin ? "right" : "initial",
                        textAlign: !isSuperAdmin ? "right" : "initial",
                      }}
                    >
                      <ReactQuill
                        value={body}
                        theme="bubble"
                        readOnly
                        style={{ color: isDark ? "#fff" : "default" }}
                      />
                    </Typography>
                  </Paper>
                  {!isSuperAdmin && (
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
    </div>
  );
};

export default ReplyList;
