import { Box, Button, useMediaQuery } from "@mui/material";
import React from "react";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";

const Options = ({ openProduct }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const buttonProps = {
    size: isSmallScreen ? "small" : "medium",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
        p: 1,
        m: 1,
        bgcolor: "background.paper",
        borderRadius: 1,
        gap: 1,
      }}
    >
      <Button
        {...buttonProps}
        variant="outlined"
        size="small"
        startIcon={<Iconify icon={"carbon:add"} />}
        onClick={openProduct}
        name="products"
      >
        <Translate>{"assign_subscriptions.productss"}</Translate>
      </Button>
    </Box>
  );
};
export default Options;
