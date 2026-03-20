import { Box, Typography } from "@mui/material";
import ActionButton from "./actionButton";

import PropTypes from "prop-types";

const Content = ({ body, isActive, subTitle, title }) => {
  return (
    <Box
      sx={{
        paddingLeft: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        width: "100%",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {title}
            </Typography>
            <Typography variant="body2" fontWeight="light">
              {subTitle}
            </Typography>
          </Box>
          <Box>
            <Typography color="greenyellow">{isActive && "Active"}</Typography>
          </Box>
        </Box>
        <Typography variant="body1" fontWeight="normal">
          {body}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItem: "center",
          justifyContent: "space-between",
        }}
      >
        <ActionButton />
      </Box>
    </Box>
  );
};

Content.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  isActive: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.bool.isRequired,
};

export default Content;
