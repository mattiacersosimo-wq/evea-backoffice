import { Box, Divider, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

import { useParams } from "react-router";
import Form from "./components/form";

const Compose = () => {
  return (
    <>
      <Stack
        sx={{
          width: "100%",
          pl: 3,
          pr: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
            pb: 2,
            pt: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">
            {"adminCommunication.mail.newMessage"}
          </Typography>
          <Divider />
        </Box>
        <Box>
          <Form />
        </Box>
      </Stack>
    </>
  );
};

Compose.propTypes = {
  isOpenCompose: PropTypes.bool,
  onCloseCompose: PropTypes.func,
};

export default Compose;
