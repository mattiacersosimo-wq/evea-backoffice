import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { EmailEditor } from "react-email-editor";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Ternary from "src/components/ternary";

import {
  default as Users,
  default as UsersSearch,
} from "src/pages/communications/Mail/components/compose/components/form/components/users";
import template from "src/routes/template.json";
import Attachment from "./components/attachment";
import Attachments from "./components/attachments";
import useCompose from "./hooks/useCompose";
import "./style.css";

const Form = () => {
  const emailEditorRef = useRef(null);

  const { methods, onSubmit } = useCompose(emailEditorRef);

  const onReady = () => {
    emailEditorRef.current.editor.loadDesign(template);
  };
  const { watch, setValue } = methods;
  const [ranks, products] = watch(["ranks", "products"]);
  const showUser = !Boolean(ranks.length || products.length);
  useEffect(() => {
    if (!showUser) {
      setValue("to_users_id", []);
    }
  }, [showUser]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2}>
        <Ternary when={showUser} then={<UsersSearch />} />

        <RHFTextField
          name="subject"
          label={"adminCommunication.mail.subject"}
        />
        {/* <FormControlLabel
          onChange={(e) => {
            setValue("is_broadcast", e.target.checked ? 1 : 0);
          }}
          control={<Attachment />}
          label="Attach"
        /> */}

        <FormControlLabel
          onChange={(e) => {
            setValue("is_broadcast", e.target.checked ? 1 : 0);
          }}
          control={<Checkbox checked={Boolean(watch("is_broadcast"))} />}
          label="Broadcast"
        />
        <Box className="emilttplate">
          <EmailEditor onReady={onReady} ref={emailEditorRef} />
        </Box>
      </Stack>
      <Attachments />

      <Divider />
      <Box
        sx={{
          py: 2,
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          "@media (min-width: 900px)": {
            // justifyContent:"center",
          },
        }}
      >
        <Box>
          <Button
            LinkComponent={Link}
            to={-1}
            sx={{
              mr: 2,
            }}
            endIcon={<Iconify icon="ic:round-close" />}
            variant="outlined"
            color="error"
          >
            {"cancel"}
          </Button>
        </Box>
        <Box>
          <Button
            endIcon={<Iconify icon="material-symbols:send-rounded" />}
            type="submit"
            variant="contained"
            name="send"
          >
            {"adminCommunication.mail.send"}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default Form;
