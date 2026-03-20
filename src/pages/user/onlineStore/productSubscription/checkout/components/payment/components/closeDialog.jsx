import { Box, IconButton } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import { PATH_USER } from "src/routes/paths";

const CloseDialog = () => {
  return (
    <Box sx={{ textAlign: "right" }}>
      <IconButton
        LinkComponent={Link}
        to={PATH_USER.onlineStore.productSubscription.root}
        name="close"
      >
        <Iconify icon="material-symbols:close" />
      </IconButton>
    </Box>
  );
};
export default CloseDialog;
