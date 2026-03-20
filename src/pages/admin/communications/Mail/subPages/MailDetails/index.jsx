import { Box, Divider, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import Scrollbar from "src/components/Scrollbar";
// import useGetMail from "src/pages/admin/dashboard/Mail/hooks/useGetMail";
import ReactQuill from "react-quill";
import useGetMail from "../../hooks/useGetMail";
import Attachments from "./components/Attachments";
import Toolbar from "./components/Toolbar";

const RootStyle = styled("div")({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
});

const MarkdownStyle = styled("div")(({ theme }) => ({
  "& > p": {
    ...theme.typography.body1,
    marginBottom: theme.spacing(2),
  },
}));

export default function MailDetails() {
  const mail = useGetMail();
  if (!mail) {
    return null;
  }

  const isAttached = mail?.files.length > 0;

  return (
    <RootStyle>
      <Toolbar
        createdAt={mail.createdAt}
        from={mail.from_id}
        to={mail.user_id}
        userId={mail.from_id.id}
      />
      {/* <Toolbar
        createdAt={mail?.createdAt}
        from={mail.from_id}
        to={mail.user_id}
        userId={mail.id}
      /> */}
      <Divider />

      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h3" gutterBottom>
            {mail?.subject}
          </Typography>
          <ReactQuill
            value={mail?.message}
            readOnly
            theme="bubble"
            modules={{
              toolbar: false,
            }}
          />
        </Box>
      </Scrollbar>

      {isAttached && <Attachments mail={mail} />}

      <Divider />

      {/* <ReplyInput /> */}
    </RootStyle>
  );
}
