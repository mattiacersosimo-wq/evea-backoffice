import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import useGetLogo from "./hooks/use-logo";

const Logo = ({ disabledLink = false }) => {
  const logo = useGetLogo();

  if (disabledLink) {
    return (
      <img
        style={{ width: "100px", height: "auto", maxHeight: "64px" }}
        src={logo}
      />
    );
  }

  return (
    <RouterLink to="/">
      <img style={{ width: "100px", height: "auto" }} src={logo} />
    </RouterLink>
  );
};

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
