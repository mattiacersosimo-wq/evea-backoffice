import PropTypes from "prop-types";
import React from "react";

const Image = ({ src }) => <img src={src} />;

Image.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Image;
