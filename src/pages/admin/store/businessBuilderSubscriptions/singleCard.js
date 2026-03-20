import { Box, Card, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import React from "react";

const RootStyle = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2, 2, 2, 3),
}));

const SingleCard = ({ title, total, icon }) => {
  return (
    <div>
      <RootStyle>
        <div>
          <Typography variant="h3">{total}</Typography>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            {title}
          </Typography>
        </div>
        <Box
          sx={{
            width: 80,
            height: 80,
            lineHeight: 0,
            borderRadius: "50%",
            bgcolor: "background.neutral",
          }}
        >
          {icon}
        </Box>
      </RootStyle>
    </div>
  );
};

SingleCard.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.string,
  total: PropTypes.number,
};

export default SingleCard;
