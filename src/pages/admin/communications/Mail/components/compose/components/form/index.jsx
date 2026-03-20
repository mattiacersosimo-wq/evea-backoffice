import { Box, Button, Checkbox, FormControlLabel, Stack } from "@mui/material";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import {
  FormProvider,
  RHFEditor,
  RHFTextField,
} from "src/components/hook-form";
import Ternary from "src/components/ternary";
import Users from "src/components/users-search";

import Attachments from "./components/attachments";
import Products from "./components/products";
import Ranks from "./components/rank";
import useCompose from "./hooks/useCompose";
import "./style.css";
import Translate from "src/components/translate";
import useAuth from "src/hooks/useAuth";
import { PATH_DASHBOARD, PATH_USER } from "src/routes/paths";

const Form = ({ userId }) => {
  const emailEditorRef = useRef(null);
  const { methods, onSubmit } = useCompose(userId);
  const { watch, setValue } = methods;
  console.log(methods.formState.errors);
  const [ranks, products] = watch(["ranks", "products"]);
  const showUser = !Boolean(ranks.length || products.length);
  useEffect(() => {
    if (!showUser) {
      setValue("to_users_id", []);
    }
  }, [showUser]);
  const { isAdmin, isSubAdmin } = useAuth();

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2}>
        <Ternary
          when={showUser && !userId}
          then={<Users multiple name="to_users_id" />}
        />

        <RHFTextField
          size="small"
          name="subject"
          label={"admin_email.compose.subject"}
        />
        <Ternary
          when={isAdmin || isSubAdmin}
          then={
            <>
              {/* <Products /> */}
              <Ranks />
              <FormControlLabel
                onChange={(e) => {
                  setValue("is_broadcast", e.target.checked ? 1 : 0);
                }}
                control={<Checkbox checked={Boolean(watch("is_broadcast"))} />}
                label="Broadcast"
              />
            </>
          }
        />

        <RHFEditor name="message" label="Description" simple />
      </Stack>
      <Attachments />

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
            to={
              isAdmin
                ? PATH_DASHBOARD.communication.mails
                : PATH_USER.helpCenter.mails.inbox
            }
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
          >
            <Translate>admin_email.compose.send</Translate>
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default Form;
