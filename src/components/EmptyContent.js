import PropTypes from "prop-types";
// @mui
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
//
import Nodata from "src/images/no-data.svg";
import Image from "./Image";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  height: "100%",
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(3, 2),
}));

// ----------------------------------------------------------------------

EmptyContent.propTypes = {
  title: PropTypes.string.isRequired,
  img: PropTypes.string,
  description: PropTypes.string,
};

export default function EmptyContent({ title, description, img, ...other }) {
  return (
    <RootStyle {...other}>
      <Image
        disabledEffect
        visibleByDefault
        alt="empty content"
        src={img || Nodata}
        sx={{ height: 200, mb: 3, objectFit: "contain" }}
      />

      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
      )}
    </RootStyle>
  );
}
