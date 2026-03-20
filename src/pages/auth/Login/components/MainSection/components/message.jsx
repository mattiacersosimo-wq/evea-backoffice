import { Box, Stack, Typography } from "@mui/material";
import Translate from "src/components/translate";
import { DOMAIN_NAME } from "src/config";

const Message = () => (
  <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4">
        <Translate>register.welcome</Translate>
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        <Translate>register.sign_to</Translate> {DOMAIN_NAME}
      </Typography>
    </Box>
  </Stack>
);

export default Message;
