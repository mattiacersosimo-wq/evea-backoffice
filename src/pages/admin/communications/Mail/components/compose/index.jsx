import { Box, Divider, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

import { useParams } from "react-router";
import Form from "./components/form";
import Translate from "src/components/translate";

const Compose = () => {
  const { id } = useParams();
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
            <Translate>admin_email.compose.title</Translate>
          </Typography>
          <Divider />
        </Box>
        <Box>
          <Form userId={id} />
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
