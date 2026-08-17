import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import useGetLogo from "./hooks/use-logo";

const Logo = ({ disabledLink = false, width = 100, maxHeight }) => {
  const logo = useGetLogo();
  const imgStyle = {
    width: `${width}px`,
    height: "auto",
    display: "block",
    margin: "0 auto",
    ...(maxHeight ? { maxHeight: `${maxHeight}px` } : {}),
  };

  if (disabledLink) {
    return <img style={{ ...imgStyle, maxHeight: `${maxHeight || 64}px` }} src={logo} alt="eVea" />;
  }

  return (
    <RouterLink to="/">
      <img style={imgStyle} src={logo} alt="eVea" />
    </RouterLink>
  );
};

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  width: PropTypes.number,
  maxHeight: PropTypes.number,
  sx: PropTypes.object,
};

export default Logo;
