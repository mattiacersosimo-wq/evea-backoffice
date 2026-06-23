import React from "react";
import Grow from "@material-ui/core/Grow";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

export default Transition;
